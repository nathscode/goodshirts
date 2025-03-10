import checkIsAdmin from "@/src/actions/checkIsAdmin";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { s3 } from "@/src/actions/getS3Client";
import db from "@/src/db";
import { medias, orderItems, orders, products } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import { handlerNativeResponse } from "@/src/lib/utils";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const logger = getLogger();
const Bucket = process.env.TEBI_BUCKET_NAME;
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	if (req.method !== "DELETE") {
		return handlerNativeResponse(
			{ status: 405, errors: { message: "Method not allowed" } },
			405
		);
	}

	try {
		// Authenticate User
		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{ status: 401, errors: { message: "Unauthorized user" } },
				401
			);
		}

		// Check if User is Admin
		const isAdmin = await checkIsAdmin();
		if (!isAdmin) {
			return handlerNativeResponse(
				{ status: 403, errors: { message: "Not authorized" } },
				403
			);
		}

		// Fetch Product by Slug
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.slug, params.slug),
		});

		// Validate Product Exists
		if (!existingProduct) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "Product not found" } },
				404
			);
		}

		// Check if Product is in Any Order
		const productInOrderItems = await db.query.orderItems.findFirst({
			where: eq(orderItems.productId, existingProduct.id),
		});

		if (productInOrderItems) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message:
							"You can't delete a product that has been ordered. Please deactivate it instead.",
					},
				},
				400
			);
		}

		// Fetch and Delete Associated Media
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
			return NextResponse.json({ status: "success" });
		}
	} catch (error: any) {
		logger.error("PRODUCT DELETE ERROR:", error);

		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
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
