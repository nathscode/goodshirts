import type { NextAuthConfig } from "next-auth";

const nextAuthConfig: NextAuthConfig = {
	providers: [],
	session: { strategy: "jwt" },
	debug: process.env.NODE_ENV !== "production",
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
