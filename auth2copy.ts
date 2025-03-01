import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Passkey from "next-auth/providers/passkey";
import { v4 as uuid } from "uuid";
import db from "@/src/db";
import {
	accounts,
	authenticators,
	sessions,
	users,
	verificationTokens,
} from "@/src/db/schema";
import { getUserFromDb } from "@/src/actions/user.action";

// Define an extended AdapterUser type with role and isAdmin
interface ExtendedAdapterUser extends AdapterUser {
	type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
	isAdmin: boolean;
	role: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER"; // Ensure role exists
}

const drizzleAdapter = DrizzleAdapter(db, {
	users,
	accounts,
	sessions,
	verificationTokens,
	authenticators,
} as any);

const adapter: Adapter = {
	createUser: async (userData) => {
		if (!drizzleAdapter.createUser) {
			throw new Error("CreateUser not implemented");
		}
		const dbUser = await drizzleAdapter.createUser(userData);
		// Ensure role exists and cast to ExtendedAdapterUser
		const extendedUser: ExtendedAdapterUser = {
			...dbUser,
			role: (dbUser as any).role, // Ensure role is retrieved
			type: (dbUser as any).role, // Set type from role
			isAdmin: (dbUser as any).role === "ADMIN",
		};
		return extendedUser;
	},
	getUser: async (id) => {
		if (!drizzleAdapter.getUser) {
			throw new Error("GetUser not implemented");
		}
		const user = await drizzleAdapter.getUser(id);
		if (!user) return null;
		const extendedUser: ExtendedAdapterUser = {
			...user,
			role: (user as any).role,
			type: (user as any).role,
			isAdmin: (user as any).role === "ADMIN",
		};
		return extendedUser;
	},
	getUserByEmail: async (email) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
		if (!user) return null;
		const extendedUser: ExtendedAdapterUser = {
			...user,
			role: user.role!,
			type: user.role!,
			isAdmin: user.role === "ADMIN",
		};
		return extendedUser;
	},
	getUserByAccount: async (providerAccountId) => {
		if (!drizzleAdapter.getUserByAccount) {
			throw new Error("GetUserByAccount not implemented");
		}
		const user = await drizzleAdapter.getUserByAccount(providerAccountId);
		if (!user) return null;
		const extendedUser: ExtendedAdapterUser = {
			...user,
			role: (user as any).role,
			type: (user as any).role,
			isAdmin: (user as any).role === "ADMIN",
		};
		return extendedUser;
	},
	linkAccount: drizzleAdapter.linkAccount,
	unlinkAccount: drizzleAdapter.unlinkAccount,
	createSession: drizzleAdapter.createSession,
	updateSession: drizzleAdapter.updateSession,
	deleteSession: drizzleAdapter.deleteSession,
	createVerificationToken: drizzleAdapter.createVerificationToken,
	useVerificationToken: drizzleAdapter.useVerificationToken,
};

const authConfig: NextAuthConfig = {
	adapter,
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await getUserFromDb(
					credentials.email as string,
					credentials.password as string
				);

				if (!user) return null;
				return user;
			},
		}),
		Passkey,
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account?.provider === "credentials") {
				token.credentials = true;
			}
			if (user) {
				token.type = user.type;
				token.isAdmin = user.isAdmin;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.type = token.type as
					| "ADMIN"
					| "EMPLOYEE"
					| "SALES"
					| "CUSTOMER";
				session.user.isAdmin = token.isAdmin as boolean;
			}
			return session;
		},
	},
	jwt: {
		encode: async function (params) {
			if (params.token?.credentials) {
				const sessionToken = uuid();
				if (!params.token.sub) {
					throw new Error("No user ID found in token");
				}

				const session = await adapter.createSession?.({
					sessionToken: sessionToken,
					userId: params.token.sub,
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
				});

				if (!session) {
					throw new Error("Failed to create session");
				}

				return sessionToken;
			}
			return defaultEncode(params);
		},
	},
	secret: process.env.AUTH_SECRET!,
	experimental: { enableWebAuthn: true },
	pages: {
		signIn: "/login",
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
