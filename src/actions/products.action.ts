"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import db from "../db";
import { medias, orderItems, products } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import checkIsAdmin from "./checkIsAdmin";
import getCurrentUser from "./getCurrentUser";
import { s3 } from "./getS3Client";
import { handlerNativeResponse } from "../lib/utils";

const Bucket = process.env.TEBI_BUCKET_NAME;
const logger = getLogger();
export async function setProductFeatured(productId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	try {
		const product = await db.query.products.findFirst({
			where: and(eq(products.id, productId)),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		const newFeaturedStatus = !product.isFeatured;

		await db.transaction(async (tx) => {
			if (newFeaturedStatus) {
				await tx
					.update(products)
					.set({ isFeatured: false })
					.where(eq(products.id, productId));
			}
			await tx
				.update(products)
				.set({ isFeatured: newFeaturedStatus })
				.where(eq(products.id, productId));
		});

		return {
			status: "success",
			message: `Product ${newFeaturedStatus ? "set" : "removed"} as featured successfully`,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update featured");
	}
}

export async function setActivateProduct(productId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}
	const isAdmin = await checkIsAdmin();
	if (!isAdmin) {
		throw Error("Not authorized");
	}
	try {
		const product = await db.query.products.findFirst({
			where: and(eq(products.id, productId)),
		});

		if (!product) {
			throw new Error("product not found");
		}

		const newActiveStatus = !product.isActive;

		await db.transaction(async (tx) => {
			if (newActiveStatus) {
				await tx
					.update(products)
					.set({ isActive: false })
					.where(eq(products.id, productId));
			}

			await tx
				.update(products)
				.set({ isActive: newActiveStatus })
				.where(eq(products.id, productId));
		});

		return {
			status: "success",
			message: `Product ${newActiveStatus ? "set" : "removed"} active successfully`,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update default Product");
	}
}

export async function deleteProduct(productId: string) {
	try {
		// Authenticate User
		const session = await getCurrentUser();
		if (!session) {
			return {
				status: "error",
				message: "Unauthenticated User. Try and Login",
			};
		}

		const isAdmin = await checkIsAdmin();
		if (!isAdmin) {
			return { status: "error", message: "Not authorized" };
		}

		const existingProduct = await db.query.products.findFirst({
			where: eq(products.id, productId),
		});

		if (!existingProduct) {
			return { status: "error", message: "Product not found" };
		}

		// Check if product exists in an order
		const productInOrderItems = await db.query.orderItems.findFirst({
			where: eq(orderItems.productId, existingProduct.id),
		});

		if (productInOrderItems) {
			return {
				status: "error",
				message:
					"You can't delete a product that has been ordered. Please deactivate it instead.",
			};
		}

		// Fetch and delete associated media
		const allMedias = await db.query.medias.findMany({
			where: eq(medias.productId, existingProduct.id),
		});

		for (const media of allMedias) {
			const filename = media.url.split("/").pop();

			if (media) {
				await db.delete(medias).where(eq(medias.id, media.id));
			}

			const bucketParams = {
				Bucket: Bucket,
				Key: `medias/${filename}`,
			};

			const command = new DeleteObjectCommand(bucketParams);
			await s3.send(command);
		}

		// Delete Product
		const deleted = await db
			.delete(products)
			.where(eq(products.id, existingProduct.id))
			.returning();

		if (deleted) {
			logger.info(`Product deleted successfully`);
			return { status: "success", message: "Product deleted successfully" };
		}

		return { status: "error", message: "Failed to delete product" };
	} catch (error: any) {
		logger.error("Database Error:", error);
		return { status: "error", message: "Failed to delete product" };
	}
}
