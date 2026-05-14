import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";

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
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };