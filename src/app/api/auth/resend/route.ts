import { handlerNativeResponse, normalizeEmail } from "@/src/lib/utils";
import { ZodError } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/src/db/schema"; // Import your Drizzle schema
import {
	ResendCodeSchema,
	ResendCodeSchemaInfer,
} from "@/src/lib/validators/auth";
import db from "@/src/db";
import { render } from "@react-email/render";
import { sendEmail } from "@/src/config/mail";
import Verification from "@/src/emails/verify-email";
import { generateUniqueVerificationCode } from "../register/route";
import { getLogger } from "nodemailer/lib/shared";

const logger = getLogger();

export async function POST(req: Request) {
	try {
		const body: ResendCodeSchemaInfer = await req.json();
		const payload = ResendCodeSchema.safeParse(body);

		if (!payload.success) {
			return handlerNativeResponse(
				{ status: 400, errors: { message: "Invalid email" } },
				400
			);
		}

		const { email } = payload.data;
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, normalizeEmail(email)));

		if (!user) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "User not found" } },
				404
			);
		}
		const newVerificationCode = await generateUniqueVerificationCode();
		await db
			.update(users)
			.set({
				verificationCode: newVerificationCode,
			})
			.where(eq(users.id, user.id));

		try {
			const htmlEmail = await render(
				Verification({ verificationCode: newVerificationCode })
			);
			await sendEmail(user.email!, "Email Verification", htmlEmail);
		} catch (error: any) {
			logger.info("USER VERIFICATION EMAIL ERROR", error);
		}

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error: any) {
		console.error("Error in /api/auth/resend:", error);

		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}
