import { eq } from "drizzle-orm";
import { handlerNativeResponse, normalizeEmail } from "@/src/lib/utils";
import { LoginSchema, LoginSchemaInfer } from "@/src/lib/validators/auth";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getLogger } from "@/src/lib/backend/logger";
import db from "@/src/db";
import { users } from "@/src/db/schema";

const logger = getLogger();

export async function POST(req: NextRequest) {
	try {
		// Parse and validate the request body
		const body: LoginSchemaInfer = await req.json();
		const payload = LoginSchema.safeParse(body);

		if (!payload.success) {
			return handlerNativeResponse(
				{ status: 400, errors: { message: payload.error.message } },
				400
			);
		}

		const { email, password } = payload.data;
		const formattedEmail = normalizeEmail(email);
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, formattedEmail))
			.limit(1);

		if (!user) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "No account found" } },
				404
			);
		}

		// Check if the user is verified
		if (!user.isEmailVerified) {
			return handlerNativeResponse(
				{
					status: 401,
					errors: {
						message:
							"Your account is not verified. Check your email for the verification code.",
					},
				},
				401
			);
		}

		// Verify the password
		const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

		if (!isPasswordValid) {
			return handlerNativeResponse(
				{ status: 400, errors: { message: "Invalid credentials" } },
				400
			);
		}
		return Response.json({
			status: 200,
			message: "You logged in successfully!",
		});
	} catch (error: any) {
		// Handle errors
		let message = "Something went wrong";
		let status = 500;

		if (error instanceof ZodError) {
			message = error.message;
			status = 422;
		}

		logger.error(error.message);
		return handlerNativeResponse({ status, errors: { message } }, status);
	}
}
