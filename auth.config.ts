import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "./src/actions/user.action";

class InvalidLoginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidLoginError";
	}
}

const nextAuthConfig: NextAuthConfig = {
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) {
					throw new InvalidLoginError("Missing email or password.");
				}

				const user = await getUserFromDb(
					credentials.email as string,
					credentials.password as string
				);

				if (!user) {
					throw new InvalidLoginError("Invalid credentials.");
				}

				return user;
			},
		}),
	],
	session: { strategy: "jwt" },
	debug: true,
	callbacks: {
		async signIn({ account, profile }) {
			return true;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
				session.user.type = token.type as
					| "ADMIN"
					| "EMPLOYEE"
					| "SALES"
					| "CUSTOMER";
				session.user.isAdmin = Boolean(token.isAdmin);
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.name = `${user.firstName} ${user.lastName}`;
				token.type = user.type;
				token.isAdmin = user.isAdmin;
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
	},
};

export default nextAuthConfig;
