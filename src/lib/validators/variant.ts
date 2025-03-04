import * as z from "zod";

export const productVariantPriceSchema = z.object({
	size: z.string().min(1).max(20),
	price: z.string().refine((val) => !isNaN(parseFloat(val)), {
		message: "Price must be a valid number",
	}),
	discountPrice: z
		.string()
		.optional()
		.refine((val) => val === undefined || !isNaN(parseFloat(val)), {
			message: "Discount price must be a valid number",
		}),
	stockQuantity: z.coerce
		.number()
		.nonnegative("Stock quantity must be a non-negative integer")
		.default(0),
	available: z.boolean().default(true),
	sizeId: z.string().optional(),
});

// Define the schema for the product variant

export const productVariantSchema = z.object({
	color: z
		.string()
		.min(1, "Color is required")
		.max(50, "Color must be 50 characters or less"),
	productPriceVariants: z.array(productVariantPriceSchema).default([]),
});

export const variantSchema = z.object({
	productSlug: z.string(),
	variants: z.array(productVariantSchema).default([]),
});

export type variantSchemaInfer = z.infer<typeof variantSchema>;
export type productVariantPriceSchemaInfer = z.infer<
	typeof productVariantPriceSchema
>;
// price: z.union([z.string(), z.number()]).transform((val) => String(val)),
// discountPrice: z
// 	.union([z.string(), z.number()])
// 	.optional()
// 	.transform((val) => (val ? String(val) : undefined)),
