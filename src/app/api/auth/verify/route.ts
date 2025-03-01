import { handlerNativeResponse, normalizeEmail } from "@/src/lib/utils";
import {
	VerifyEmailSchema,
	VerifyEmailSchemaInfer,
} from "@/src/lib/validators/auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import db from "@/src/db";

export async function POST(req: NextRequest) {
	try {
		// Parse and validate the request body
		const body: VerifyEmailSchemaInfer = await req.json();
		const payload = VerifyEmailSchema.safeParse(body);

		if (!payload.success) {
			return handlerNativeResponse(
				{ status: 400, errors: { message: "Invalid code or email" } },
				400
			);
		}

		const { email, verificationCode } = payload.data;
		const formattedEmail = normalizeEmail(email!);

		// Find the user and verify the code in a single query
		const [user] = await db
			.select()
			.from(users)
			.where(
				and(
					eq(users.email, formattedEmail),
					eq(users.verificationCode, verificationCode.trim()),
					eq(users.verified, false),
					eq(users.isEmailVerified, false)
				)
			);

		if (!user) {
			return handlerNativeResponse(
				{
					status: 404,
					errors: { message: "User not found or code is invalid" },
				},
				404
			);
		}

		// Update the user's verification status
		await db
			.update(users)
			.set({
				verified: true,
				isEmailVerified: true,
				emailVerified: new Date(),
			})
			.where(eq(users.id, user.id));

		return NextResponse.json({ verified: true });
	} catch (error: any) {
		// Handle specific errors
		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		// Log unexpected errors for debugging
		console.error("Unexpected error in /api/verify-email:", error);

		// Return a generic server error response
		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}
