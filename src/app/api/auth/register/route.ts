import { handlerNativeResponse, normalizeEmail } from "@/src/lib/utils";
import { RegisterSchema, RegisterSchemaInfer } from "@/src/lib/validators/auth";
import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { generate } from "otp-generator";
import { ZodError } from "zod";
import { getLogger } from "@/src/lib/backend/logger";
import { users } from "@/src/db/schema"; // Import your Drizzle schema
import { eq } from "drizzle-orm"; // Import query helpers
import db from "@/src/db";
import Verification from "@/src/emails/verify-email";
import { sendEmail } from "@/src/config/mail";
import { site } from "@/src/config/site";

const logger = getLogger();

export async function generateUniqueVerificationCode(): Promise<string> {
	let verificationCode: string;
	do {
		verificationCode = generate(6, {
			digits: true,
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		// Check if the verification code already exists in the database
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.verificationCode, verificationCode))
			.limit(1);
		if (existingUser.length === 0) break; // Exit loop if no user has this code
	} while (true);
	return verificationCode;
}

export async function POST(req: NextRequest) {
	try {
		// Parse and validate the request body
		const body: RegisterSchemaInfer = await req.json();
		const payload = RegisterSchema.safeParse(body);

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

		const { email, firstName, lastName, phone, password } = payload.data;
		const formattedEmail = normalizeEmail(email);

		// Check if the email already exists
		const [existingEmailUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, formattedEmail));

		if (existingEmailUser) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Email already taken. Please use another email.",
					},
				},
				409
			);
		}

		// Check if the username already exists
		const [existingUsernameUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.phoneNumber, phone));

		if (existingUsernameUser) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Phone Number already exist. Please use another number.",
					},
				},
				409
			);
		}

		// Hash the password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Generate a unique verification code
		const verificationCode = await generateUniqueVerificationCode();

		// Create the new user
		const [newUser] = await db
			.insert(users)
			.values({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: formattedEmail,
				phoneNumber: phone.trim(),
				verificationCode,
				passwordHash: hashedPassword,
				role: "CUSTOMER",
			})
			.returning();

		if (!newUser) {
			return handlerNativeResponse(
				{ status: 400, message: "No user created" },
				400
			);
		}

		try {
			const htmlEmail = await render(Verification({ verificationCode }));
			const emailPayload = {
				from: {
					email: `goodshirtsafrica@gmail.com`,
					name: `${site.name} <no-reply@${site.domain}>`,
				},
				subject: `Email Verification - [${site.name}] `,
				html: htmlEmail,
				params: {
					orderId: newUser.id,
					customerName: newUser.firstName,
				},
			};

			await sendEmail({
				...emailPayload,
				to: newUser.email!,
				subject: `Email Verification`,
			});
		} catch (error: any) {
			logger.info("USER VERIFICATION EMAIL ERROR", error);
		}

		return NextResponse.json({ email: newUser.email });
	} catch (error: any) {
		logger.info("USER REGISTRATION ERROR", error);

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
