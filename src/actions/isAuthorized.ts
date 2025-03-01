"use server";

import { auth } from "@/auth";

export default async function isAuthorized() {
	const session = await auth();
	return session;
}
