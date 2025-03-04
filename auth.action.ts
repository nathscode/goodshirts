import NextAuth from "next-auth";
import nextAuthConfig from "@/auth.config";
import nextAuthConfigProvider from "./auth.config.provider";

const authConfig = { ...nextAuthConfig, ...nextAuthConfigProvider };

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
