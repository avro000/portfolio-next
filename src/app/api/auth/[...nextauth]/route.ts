import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";

// Session lifetime in seconds — 10s for testing, change to 86400 (24hr) for production
const SESSION_MAX_AGE = 10;

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
      // First sign-in: stamp the absolute expiry time
      if (user) {
        token.expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
      }

      // On subsequent requests: check if session has expired
      if (token.expiresAt && Date.now() > (token.expiresAt as number)) {
        // Return empty object to invalidate the session
        return {} as any;
      }

      return token;
    },
    async session({ session, token }) {
      // If the token was invalidated (no email), return empty session
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