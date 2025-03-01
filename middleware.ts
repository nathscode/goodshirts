import { auth } from "@/auth";

export default auth((req) => {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;
	const isLoggedIn = !!req.auth;
	const isAdmin = req.auth?.user?.isAdmin ?? false;

	if (!isLoggedIn) {
		console.log("User not authenticated, redirecting to login...");
		return Response.redirect(new URL("/login", nextUrl));
	}

	if (isAdmin && pathname !== "/dashboard" && !pathname.startsWith("/api")) {
		console.log("Admin detected, redirecting to dashboard...");
		return Response.redirect(new URL("/dashboard", nextUrl));
	}

	if (pathname.startsWith("/dashboard") && !isAdmin) {
		console.log("Non-admin trying to access dashboard, redirecting home...");
		return Response.redirect(new URL("/", nextUrl));
	}

	console.log("Middleware executed.");
	return;
});

export const config = {
	matcher: ["/customer/:path*", "/api/:path*", "/dashboard/:path*"],
};
