"use server";

import { auth } from "@/auth";
import { CustomSession, CustomUser } from "../types";
import { eq } from "drizzle-orm";
import db from "../db";
import { users } from "@/src/db/schema";

export async function getSession() {
	return await auth();
}

export default async function getCurrentUser(): Promise<CustomUser | null> {
	try {
		const session = await auth();
		if (!session?.user) return null;

		const currentUser = await db.query.users.findFirst({
			where: eq(users.email, session.user.email),
		});

		if (!currentUser) {
			return null;
		}

		// ✅ Ensuring the result conforms to `CustomUser`
		const formattedUser: CustomUser = {
			id: currentUser.id || undefined,
			firstName: currentUser.firstName ?? null,
			lastName: currentUser.lastName ?? null,
			type: currentUser.role as "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER",
			isAdmin: currentUser.role === "ADMIN",
			email: currentUser.email ?? null,
			phone: currentUser.phoneNumber ?? null,
			image: currentUser.image ?? null,
		};

		return formattedUser;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
}
