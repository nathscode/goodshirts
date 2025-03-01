import { z } from "zod";

export const ReviewSchema = z.object({
	productId: z.string().optional(),
	rating: z.number().optional(),
	title: z.string().min(2, {
		message: "title must be at least 2 characters.",
	}),
	name: z.string().optional(),
	comment: z.string().min(2, {
		message: "comment must be at least 2 characters.",
	}),
});

export type ReviewSchemaInfer = z.infer<typeof ReviewSchema>;
