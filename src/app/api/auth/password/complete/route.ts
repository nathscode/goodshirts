import db from "@/src/db";
import { passwordReset, users } from "@/src/db/schema"; // Import your Drizzle schema
import { getLogger } from "@/src/lib/backend/logger";
import { handlerNativeResponse } from "@/src/lib/utils";
import {
	ResetPasswordSchema,
	ResetPasswordSchemaInfer,
} from "@/src/lib/validators/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm"; // Import query helpers
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
const logger = getLogger();

export async function POST(req: NextRequest) {
	try {
		const body: ResetPasswordSchemaInfer = await req.json();
		const payload = ResetPasswordSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}

		const { password, confirmPassword, token } = payload.data;

		if (!token) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Token not specified",
					},
				},
				400
			);
		}
		if (!password) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "New password not specified",
					},
				},
				400
			);
		}
		if (!confirmPassword) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Repeat new password",
					},
				},
				400
			);
		}
		if (password !== confirmPassword) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "New password doesn't matc",
					},
				},
				400
			);
		}
		const passwordResetObj = await db.query.passwordReset.findFirst({
			where: eq(passwordReset.code, String(token)),
		});
		if (!passwordResetObj) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Invalid token",
					},
				},
				400
			);
		}

		const expiredAtFormatted = passwordResetObj?.expiresAt!.toISOString();

		const expire_date = DateTime.fromISO(expiredAtFormatted);
		const now_date = DateTime.now();
		if (now_date > expire_date) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message:
							"Link is expired. Please, try again from reset password page",
					},
				},
				400
			);
		}
		const user = await db.query.users.findFirst({
			where: eq(users.email, passwordResetObj.email),
		});

		if (!user) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Invalid request",
					},
				},
				400
			);
		}
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		await db
			.update(users)
			.set({
				passwordHash: hashedPassword,
			})
			.where(eq(users.email, passwordResetObj.email));

		await db
			.delete(passwordReset)
			.where(eq(passwordReset.id, passwordResetObj.id));

		return NextResponse.json({
			status: true,
			message: "Success",
		});
	} catch (error: any) {
		logger.info("PASSWORD RESET ERROR", error);

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

		// Return a generic server error response
		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}
