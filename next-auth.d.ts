import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend NextAuth types
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			firstName?: string | null;
			lastName?: string | null;
			type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
			isAdmin: boolean;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
		isAdmin: boolean;
		firstName?: string | null;
		lastName?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		type?: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
		isAdmin?: boolean;
		credentials?: boolean;
	}
}

// Extend AdapterUser
declare module "@auth/core/adapters" {
	interface AdapterUser extends DefaultUser {
		type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
		isAdmin: boolean;
		firstName?: string | null;
		lastName?: string | null;
	}
}
