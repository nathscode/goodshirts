import { auth } from "@/auth";

export default auth((req) => {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;
	const isLoggedIn = !!req.auth;
	const isAdmin = req.auth?.user?.isAdmin ?? false;

	if (!isLoggedIn) {
		return Response.redirect(new URL("/login", nextUrl));
	}
	if (pathname.startsWith("/dashboard") && !isAdmin) {
		return Response.redirect(new URL("/", nextUrl));
	}
	return;
});

export const config = {
	matcher: [
		"/customer/:path*",
		"/checkout/:path*",
		"/api/:path*",
		"/dashboard/:path*",
	],
};
