import NextAuth from "next-auth";
import nextAuthConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthConfig);
