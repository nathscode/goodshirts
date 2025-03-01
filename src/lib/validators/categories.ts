import { z } from "zod";

export const CategoriesSchema = z.object({
	name: z.string().min(1, { message: "name required" }),
	slug: z.string().optional(),
	description: z.string().optional(),
});
export type CategoriesSchemaInfer = z.infer<typeof CategoriesSchema>;

export const SubCategoriesSchema = z.object({
	name: z.string().min(1, { message: "name required" }),
	categorySlug: z.string(),
	slug: z.string().optional(),
	description: z.string().optional(),
});
export type SubCategoriesSchemaInfer = z.infer<typeof SubCategoriesSchema>;
