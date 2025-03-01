import { z } from "zod";

export const orderUpdateSchema = z.object({
	status: z.string().min(1, {
		message: "Status is required",
	}),
	orderId: z.string().optional(),
});

export type orderUpdateSchemaInfer = z.infer<typeof orderUpdateSchema>;
