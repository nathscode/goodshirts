import { z } from "zod";

export const orderUpdateSchema = z.object({
	status: z.string().min(1, {
		message: "Status is required",
	}),
	orderId: z.string().optional(),
});

export type orderUpdateSchemaInfer = z.infer<typeof orderUpdateSchema>;

export const GuestUserSchema = z.object({
	email: z.string().email().min(1, { message: "email required" }),
	phoneNumber: z.string().min(10, { message: "phone number required" }),
	whatsappNumber: z.string().optional(),
	firstName: z.string().min(2, { message: "first name required" }),
	lastName: z.string().min(2, { message: "last name required" }),
	state: z.string().min(2, { message: "state required" }),
	lga: z.string().min(2, { message: "lga required" }),
	city: z.string().min(2, { message: "city required" }),
	streetAddress: z.string().min(5, { message: "street address required" }),
});
export type GuestUserSchemaInfer = z.infer<typeof GuestUserSchema>;
