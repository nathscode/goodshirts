"use server";
import getCurrentUser from "./getCurrentUser";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { products, savedProducts } from "../db/schema";
import db from "../db";

export async function savedProductAction({ productId }: { productId: string }) {
	const session = await getCurrentUser();

	if (!session) {
		return { status: "error", message: "Log in to save this product" };
	}
	const userId = session.id!;

	// Fetch the product
	const [product] = await db
		.select()
		.from(products)
		.where(eq(products.id, productId))
		.limit(1);

	if (!product) {
		return { status: "error", message: "product not found." };
	}

	// Check if the product is already saved by the user
	const [savedProduct] = await db
		.select()
		.from(savedProducts)
		.where(
			and(
				eq(savedProducts.productId, productId),
				eq(savedProducts.userId, userId)
			)
		)
		.limit(1);

	if (savedProduct) {
		// If the product is already saved, unsave it
		try {
			await db
				.delete(savedProducts)
				.where(
					and(
						eq(savedProducts.productId, productId),
						eq(savedProducts.userId, userId)
					)
				);
			revalidatePath(`/product/${product.slug}`);
			return { status: "success", message: "product Unsaved" };
		} catch (error) {
			return {
				message: "Database Error: Failed to Unsave product.",
			};
		}
	}

	// If the product is not saved, save it
	try {
		await db.insert(savedProducts).values({
			productId,
			userId,
		});
		return { status: "success", message: "product Saved" };
	} catch (error) {
		return {
			message: "Database Error: Failed to Save product.",
		};
	}
}
