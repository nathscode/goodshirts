"use server";
import { signIn, signOut } from "@/auth.action";
import { Users, users } from "@/src/db/schema";
import { LoginSchema } from "@/src/lib/validators/auth";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import db from "@/src/db/";
import { User } from "next-auth";
import { UserType } from "../types";
import { AdapterUser } from "next-auth/adapters";
import { mapToAdapterUser } from "../lib/backend/map-to-users";

export async function getUserFromDb(
	email: string,
	password: string
): Promise<AdapterUser | null> {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (!user || !user.passwordHash) return null;

		const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
		if (!isPasswordValid) return null;

		return mapToAdapterUser(user);
	} catch (error) {
		console.error("Error in getUserFromDb:", error);
		return null;
	}
}
export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	try {
		LoginSchema.parse({
			email,
			password,
		});

		const res = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		return {
			success: true,
			data: res,
		};
	} catch (error: any) {
		return {
			success: false,
			message: "Email or password is incorrect.",
		};
	}
}

export async function logout() {
	try {
		await signOut({
			redirect: false,
		});
		return {
			success: true,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message,
		};
	}
}

export async function getUserByEmail(
	email: string
): Promise<AdapterUser | null> {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
		if (!user) return null;

		return mapToAdapterUser(user);
	} catch (error) {
		console.error("Error in getUserFromDb:", error);
		return null;
	}
}
