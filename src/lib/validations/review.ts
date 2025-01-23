import { z } from "zod";

export const ReviewSchema = z.object({
	rating: z.number().min(2, {
		message: "rating must be at least 2 characters.",
	}),
	title: z.string().min(2, {
		message: "title must be at least 2 characters.",
	}),
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	message: z.string().min(2, {
		message: "message must be at least 2 characters.",
	}),
});

export type ReviewSchemaInfer = z.infer<typeof ReviewSchema>;
