import { revalidatePath } from "next/cache";
import { eq, and, exists } from "drizzle-orm";
import { getLogger } from "@/src/lib/backend/logger";
import { NextRequest } from "next/server";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { products, savedProducts } from "@/src/db/schema";
import db from "@/src/db";
import { z } from "zod";

const logger = getLogger();

// Schema for request body validation
const SaveProductSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	variantId: z.string().min(1, "Variant ID is required"),
	sizeId: z.string().min(1, "Size ID is required"),
});

export async function POST(req: NextRequest) {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return Response.json(
				{ status: "error", message: "Log in to save this product" },
				{ status: 401 }
			);
		}

		const { productId, variantId, sizeId } = SaveProductSchema.parse(
			await req.json()
		);

		const userId = session.id!;

		// Check if the product exists
		const productExists = await db
			.select()
			.from(products)
			.where(eq(products.id, productId))
			.execute();

		if (productExists.length === 0) {
			return Response.json(
				{ status: "error", message: "Product not found" },
				{ status: 404 }
			);
		}

		// Check if the product variant + size combo is already saved
		const isSaved = await db
			.select()
			.from(savedProducts)
			.where(
				and(
					eq(savedProducts.productId, productId),
					eq(savedProducts.userId, userId),
					eq(savedProducts.variantId, variantId),
					eq(savedProducts.sizeId, sizeId)
				)
			)
			.execute();

		if (isSaved.length > 0) {
			// Unsave the product
			await db
				.delete(savedProducts)
				.where(
					and(
						eq(savedProducts.productId, productId),
						eq(savedProducts.userId, userId),
						eq(savedProducts.variantId, variantId),
						eq(savedProducts.sizeId, sizeId)
					)
				);

			revalidatePath(`/product/${productId}`);
			return Response.json(
				{ status: "success", message: "Product Unsaved" },
				{ status: 200 }
			);
		}

		// Save the product with variant and size
		await db.insert(savedProducts).values({
			productId,
			userId,
			variantId,
			sizeId,
		});

		revalidatePath(`/product/${productId}`);
		return Response.json(
			{ status: "success", message: "Product Saved" },
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error in saving product:", error);
		return Response.json(
			{ status: "error", message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
