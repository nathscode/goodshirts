import checkIsAdmin from "@/src/actions/checkIsAdmin";
import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import {
	productVariantPrices,
	productVariants,
	products,
} from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import {
	generateProductSKU,
	handlerNativeResponse,
	trimAndUppercase,
} from "@/src/lib/utils";
import {
	variantSchema,
	variantSchemaInfer,
} from "@/src/lib/validators/variant";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const logger = getLogger();

// Helper function to handle authorization
async function authorizeRequest() {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthorized user");
	}
	const isAdmin = await checkIsAdmin();
	if (!isAdmin) {
		throw new Error("Not authorized to make this request");
	}
}

// Helper function to validate and parse the request body
async function validateRequestBody(req: NextRequest) {
	const body: variantSchemaInfer = await req.json();
	const payload = variantSchema.safeParse(body);
	if (!payload.success) {
		throw new ZodError(payload.error.errors);
	}
	return payload.data;
}

// Helper function to find the product by slug
async function findProductBySlug(productSlug: string) {
	const product = await db.query.products.findFirst({
		where: eq(products.slug, productSlug),
	});
	if (!product) {
		throw new Error("Product not found");
	}
	return product;
}
// ,

// Helper function to insert product variants and their prices
async function insertProductVariants(
	productId: string,
	productName: string,
	variants: variantSchemaInfer["variants"]
) {
	return await db.transaction(async (tx) => {
		try {
			const insertedVariants = [];
			for (const variant of variants) {
				let retries = 3; // Number of retries
				let insertedVariant: any;

				while (retries > 0) {
					try {
						const sku = await generateProductSKU(
							`${productName} ${variant.color}`,
							productVariants
						);

						[insertedVariant] = await tx
							.insert(productVariants)
							.values({
								productId,
								color: variant.color,
								sku: sku,
							})
							.returning({ id: productVariants.id });

						break; // Exit the loop if insertion succeeds
					} catch (error: any) {
						if (
							error.message.includes(
								"duplicate key value violates unique constraint"
							)
						) {
							retries--;
							if (retries === 0) {
								throw new Error(
									"Failed to insert variant after multiple retries"
								);
							}
						} else {
							throw error; // Re-throw other errors
						}
					}
				}

				if (insertedVariant?.id) {
					const priceVariants = variant.productPriceVariants.map(
						(priceVariant) => ({
							variantId: insertedVariant.id,
							size: trimAndUppercase(priceVariant.size!),
							price: priceVariant.price.toString(),
							discountPrice: priceVariant.discountPrice?.toString() || null,
							stockQuantity: priceVariant.stockQuantity,
						})
					);
					await tx.insert(productVariantPrices).values(priceVariants);
					insertedVariants.push(insertedVariant);
				}
			}
			return insertedVariants;
		} catch (error) {
			await tx.rollback(); // Roll back the transaction on error
			throw error; // Re-throw the error to be handled by the caller
		}
	});
}
export async function POST(req: NextRequest) {
	try {
		// Validate and parse the request body
		const { productSlug, variants } = await validateRequestBody(req);

		// Check authorization
		await authorizeRequest();

		// Find the product by slug
		const existingProduct = await findProductBySlug(productSlug);

		// Insert product variants and their prices
		const result = await insertProductVariants(
			existingProduct.id,
			existingProduct.name,
			variants
		);

		logger.info("Product variants created successfully");
		return NextResponse.json({ status: "success", data: result });
	} catch (error: any) {
		logger.error("PRODUCT VARIANT CREATION ERROR:", error);

		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		if (error.message === "Unauthorized user") {
			return handlerNativeResponse(
				{ status: 401, errors: { message: error.message } },
				401
			);
		}

		if (error.message === "Not authorized to make this request") {
			return handlerNativeResponse(
				{ status: 403, errors: { message: error.message } },
				403
			);
		}

		if (error.message === "Product not found") {
			return handlerNativeResponse(
				{ status: 404, errors: { message: error.message } },
				404
			);
		}

		return handlerNativeResponse(
			{
				status: 500,
				errors: { message: error.message || "Something went wrong" },
			},
			500
		);
	}
}
