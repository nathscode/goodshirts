import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "./src/actions/user.action";

class InvalidLoginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidLoginError";
	}
}

const nextAuthConfigProvider: NextAuthConfig = {
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
};

export default nextAuthConfigProvider;
