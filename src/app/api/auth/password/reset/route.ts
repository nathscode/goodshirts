import { sendEmail } from "@/src/config/mail";
import { site } from "@/src/config/site";
import db from "@/src/db";
import { passwordReset, users } from "@/src/db/schema"; // Import your Drizzle schema
import PasswordResetEmail from "@/src/emails/reset-password-email";
import { getLogger } from "@/src/lib/backend/logger";
import { generateRandomNumbers, handlerNativeResponse } from "@/src/lib/utils";
import {
	ResetPasswordEmailSchema,
	ResetPasswordEmailSchemaInfer,
} from "@/src/lib/validators/auth";
import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm"; // Import query helpers
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
const logger = getLogger();
export async function POST(req: NextRequest) {
	try {
		const body: ResetPasswordEmailSchemaInfer = await req.json();
		const payload = ResetPasswordEmailSchema.safeParse(body);
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

		const { email } = payload.data;

		const formattedEmail = email.toLowerCase();

		const [user] = await db
			.select({ id: users.id, verified: users.verified, name: users.firstName })
			.from(users)
			.where(eq(users.email, formattedEmail));

		if (!user) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Account not found",
					},
				},
				409
			);
		}
		if (!user.verified) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Account not verified",
					},
				},
				409
			);
		}
		const expires = DateTime.now().plus({ hours: 1 }).toJSDate();
		const rand = generateRandomNumbers(20);
		const token = bcrypt.hashSync(`${rand}`);

		const serializedToken = token
			.substring(8)
			.replace("/", "")
			.replace(".", "");
		const [resetEmailObj] = await db
			.insert(passwordReset)
			.values({
				email: formattedEmail,
				code: serializedToken,
				expiresAt: expires,
			})
			.returning();
		if (!resetEmailObj) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Failed to create reset password token",
					},
				},
				409
			);
		}
		const emailHtml = await render(
			PasswordResetEmail({ token: serializedToken, name: user.name! })
		);
		const emailPayload = {
			from: {
				email: `goodshirtsafrica@gmail.com`,
				name: `${site.name} <no-reply@${site.domain}>`,
			},
			subject: `Password Reset Link - [${site.name}] `,
			html: emailHtml, // ✅ Now a string
			params: {
				orderId: resetEmailObj.id,
				customerName: user.name,
			},
		};

		await sendEmail({
			...emailPayload,
			to: resetEmailObj.email!,
			subject: `Password Reset Link`,
		});

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
