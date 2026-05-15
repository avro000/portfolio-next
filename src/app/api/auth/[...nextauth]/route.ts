import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";

const SESSION_MAX_AGE = 86400;

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail || credentials.email.toLowerCase() !== adminEmail) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db("portfolio");

        const admin = await db
          .collection("admins")
          .findOne({ email: adminEmail });

        if (!admin) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isValid) return null;

        return {
          id: admin._id.toString(),
          name: "Admin",
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    // Don't auto-extend the session on access — let it actually expire
    updateAge: SESSION_MAX_AGE + 1,
  },
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: stamp expiry and issue time
      if (user) {
        token.expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
        token.issuedAt = Date.now();
      }

      // Check if session has expired by time
      if (token.expiresAt && Date.now() > (token.expiresAt as number)) {
        return {} as any;
      }

      // Check if password was changed after this token was issued (logout all devices)
      if (token.email && token.issuedAt) {
        try {
          const client = await clientPromise;
          const db = client.db("portfolio");
          const admin = await db.collection("admins").findOne({ email: token.email as string });

          if (admin?.passwordChangedAt) {
            const changedAt = new Date(admin.passwordChangedAt).getTime();
            if (changedAt > (token.issuedAt as number)) {
              return {} as any;
            }
          }
        } catch {
          // DB error — don't invalidate, let it retry next poll
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.email) {
        return {} as any;
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };