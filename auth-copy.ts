import type { Adapter, AdapterUser } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Passkey from "next-auth/providers/passkey";
import type { AdapterAuthenticator } from "@auth/core/adapters";
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

// @ts-ignore
const adapter: Adapter = {
	...drizzleAdapter,

	createUser: async (userData) => {
		if (!drizzleAdapter.createUser) {
			throw new Error("CreateUser not implemented");
		}
		const dbUser = await drizzleAdapter.createUser(userData);
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

	// ✅ Fix: Added missing adapter methods for WebAuthn support
	getAccount: async (providerAccountId, provider) => {
		if (!drizzleAdapter.getAccount) {
			throw new Error("getAccount not implemented");
		}
		return drizzleAdapter.getAccount(providerAccountId, provider);
	},

	getAuthenticator: async (credentialID) => {
		const authenticator = await db.query.authenticators.findFirst({
			where: eq(authenticators.credentialID, credentialID), // ✅ Corrected field name
		});
		return authenticator || null;
	},

	createAuthenticator: async (authenticatorData) => {
		const [newAuthenticator] = await db
			.insert(authenticators)
			.values(authenticatorData)
			.returning(); // ✅ Ensure it returns the new authenticator

		if (!newAuthenticator) {
			throw new Error("Failed to create authenticator");
		}

		return newAuthenticator as AdapterAuthenticator; // ✅ Cast to AdapterAuthenticator
	},
	listAuthenticatorsByUserId: async (userId) => {
		const userAuthenticators = await db.query.authenticators.findMany({
			where: eq(authenticators.userId, userId),
		});
		return userAuthenticators;
	},

	updateAuthenticatorCounter: async (credentialID, newCounter) => {
		const authenticator = await db.query.authenticators.findFirst({
			where: eq(authenticators.credentialID, credentialID), // ✅ Corrected field name
		});

		if (!authenticator) {
			throw new Error("Authenticator not found");
		}

		// Update counter
		await db
			.update(authenticators)
			.set({ counter: newCounter })
			.where(eq(authenticators.credentialID, credentialID));

		// Return the updated authenticator
		return {
			credentialID: authenticator.credentialID,
			counter: newCounter,
			userId: authenticator.userId,
			transports: authenticator.transports,
		} as AdapterAuthenticator;
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
	experimental: { enableWebAuthn: true }, // Change to false if you don't need Passkeys
	pages: {
		signIn: "/login",
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
