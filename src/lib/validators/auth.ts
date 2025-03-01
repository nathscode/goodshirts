import * as z from "zod";

export const RegisterSchema = z
	.object({
		firstName: z.string().min(2, {
			message: "first name must be at least 2 characters.",
		}),
		lastName: z.string().min(1, { message: "last name is required" }),
		role: z.string().optional(),
		email: z.string().email().min(1, {
			message: "Invalid email address",
		}),
		phone: z.string().min(1, { message: "Phone number is required" }),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});

export type RegisterSchemaInfer = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "This field has to be filled." })
		.email("This is not a valid email."),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must have than 8 characters"),
});

export type LoginSchemaInfer = z.infer<typeof LoginSchema>;

export const VerifyEmailSchema = z.object({
	email: z
		.string()
		.min(1, {
			message: "Email address is required.",
		})
		.optional(),
	verificationCode: z.string().min(6, {
		message: "verification code must be at least 6 characters.",
	}),
});
export type VerifyEmailSchemaInfer = z.infer<typeof VerifyEmailSchema>;

export const ResendCodeSchema = z.object({
	email: z.string().min(1, {
		message: "Email address is required.",
	}),
});
export type ResendCodeSchemaInfer = z.infer<typeof ResendCodeSchema>;

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email().min(1, {
		message: "Invalid email address",
	}),
});

export type ResetPasswordEmailSchemaInfer = z.infer<
	typeof ResetPasswordEmailSchema
>;

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		token: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});

export type ResetPasswordSchemaInfer = z.infer<typeof ResetPasswordSchema>;
