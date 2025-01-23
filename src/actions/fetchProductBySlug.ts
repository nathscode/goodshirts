"use server";
import { db } from "@/config/db.config";
import { ProductWithExtras } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export default async function fetchProductBySlug(
	slug: string
): Promise<ProductWithExtras | null> {
	noStore();
	if (!slug) {
		return null;
	}
	try {
		const product = await db.product.findUnique({
			where: { slug },
			include: {
				user: true,
				medias: true,
			},
		});

		if (!product) {
			return null;
		}

		const plainProperty = JSON.parse(JSON.stringify(product));
		return plainProperty;
	} catch (error) {
		console.log("Error in fetching product slug", error);
		return null;
	}
}
