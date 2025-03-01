import { z } from "zod";

export const collectionSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().optional(),
	description: z.string().optional(),
	isActive: z.boolean().default(true),
	startDate: z.string().optional().nullable(),
	endDate: z.string().optional().nullable(),
	productIds: z.array(z.string()).optional(),
});
export type collectionSchemaInfer = z.infer<typeof collectionSchema>;
