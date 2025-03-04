import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { productVariantPriceSchema } from "@/src/lib/validators/variant";
import { ZodError } from "zod";
import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { productVariantPrices } from "@/src/db/schema";
import checkIsAdmin from "@/src/actions/checkIsAdmin";

export async function PATCH(
	req: Request,
	{ params }: { params: { variantId: string } }
) {
	try {
		const session = await getCurrentUser();
		const isAdmin = await checkIsAdmin();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized. Please log in." },
				{ status: 401 }
			);
		}
		if (!isAdmin) {
			return NextResponse.json(
				{ error: "You're not allowed to carry out this action." },
				{ status: 401 }
			);
		}

		const { variantId } = params;
		if (!variantId) {
			return NextResponse.json(
				{ error: "Variant ID is required" },
				{ status: 400 }
			);
		}

		// Validate the request body
		const body = await req.json();
		const validatedData = productVariantPriceSchema.parse(body);

		// Update the variant in the database
		const updatedVariant = await db
			.update(productVariantPrices)
			.set({
				size: validatedData.size,
				price: validatedData.price,
				discountPrice: validatedData.discountPrice,
				stockQuantity: validatedData.stockQuantity,
			})
			.where(eq(productVariantPrices.id, variantId))
			.returning();

		if (!updatedVariant || updatedVariant.length === 0) {
			return NextResponse.json(
				{ error: "Variant not found or update failed" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ status: "success", data: updatedVariant[0] },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 }
			);
		}
		console.error("Error updating variant:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
