import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import { LoginSchema } from "./schemas";
import { getUserByEmail, getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    }
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          console.log("Login attempt for:", email);

          const user = await getUserByEmail(email);

          if (!user) {
            console.log("User not found:", email);
            return null;
          }

          if (!user.password) {
            console.log("User has no password:", email);
            return null;
          }

          console.log("Comparing passwords...");
          const isValid = await bcrypt.compare(password, user.password);

          console.log("Password valid:", isValid);

          if (isValid) return user;

          return null;
        }

        console.log("Validation failed");
        return null;
      },
    }),
  ],
});