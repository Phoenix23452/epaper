// # NextAuth Config (app/api/auth/[...nextauth]/route.ts)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserRepository from "@/repos/UserRepository";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const userRepo = new UserRepository();
        const user = await userRepo.verifyPassword(
          credentials.email,
          credentials.password,
        );
        if (!user) return null;
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/st-admin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
