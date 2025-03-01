import { z } from "zod";

export const ProductSchema = z.object({
	name: z.string().min(1, { message: "name required" }),
	slug: z.string().optional(),
	stock: z.coerce.number().optional(),
	category: z.string().min(1, { message: "category is required" }),
	subCategory: z.string().min(1, { message: "sub category is required" }),
	description: z.string().min(1, { message: "description is required" }),
	price: z.coerce.number().optional(),
	discountPrice: z.coerce.number().optional(),
});
export type ProductSchemaInfer = z.infer<typeof ProductSchema>;
