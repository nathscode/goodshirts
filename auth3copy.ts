import { getUserFromDb } from "@/src/actions/user.action";
import db from "@/src/db";
import {
	accounts,
	authenticators,
	sessions,
	users,
	verificationTokens,
} from "@/src/db/schema";
import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Passkey from "next-auth/providers/passkey";

// ✅ Define an extended AdapterUser type with role and isAdmin
interface ExtendedAdapterUser extends AdapterUser {
	type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
	isAdmin: boolean;
	role: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
}

const drizzleAdapter = DrizzleAdapter(db, {
	users,
	accounts,
	sessions,
	verificationTokens,
	authenticators,
} as any);

// ✅ Create Adapter with debugging logs
// @ts-ignore
const adapter: Adapter = {
	...drizzleAdapter,

	createUser: async (userData) => {
		const dbUser = await drizzleAdapter.createUser!(userData);
		const extendedUser: ExtendedAdapterUser = {
			...dbUser,
			role: (dbUser as any).role,
			type: (dbUser as any).role,
			isAdmin: (dbUser as any).role === "ADMIN",
		};
		return extendedUser;
	},

	getUser: async (id) => {
		const user = await drizzleAdapter.getUser!(id);
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
		const user = await drizzleAdapter.getUserByAccount!(providerAccountId);
		if (!user) return null;
		const extendedUser: ExtendedAdapterUser = {
			...user,
			role: (user as any).role,
			type: (user as any).role,
			isAdmin: (user as any).role === "ADMIN",
		};
		return extendedUser;
	},
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
				if (!user) {
					return null;
				}
				return user;
			},
		}),
		Passkey,
	],
	session: {
		strategy: "jwt", // ✅ Ensure session is stored in DB
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.type = user.type;
				token.isAdmin = user.isAdmin;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
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
	pages: {
		signIn: "/login",
	},
	experimental: { enableWebAuthn: true },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
