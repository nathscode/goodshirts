import getAllProducts from "@/src/actions/getAllProducts";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getAllProducts();

	const searchLandingPages = products
		?.map((product) => ({
			url: `${baseUrl}/${products}/${product.slug}`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		}))
		.flat() as MetadataRoute.Sitemap;

	return [
		// Insert your other pages:
		{
			url: `${baseUrl}/about`,
			lastModified: "2024-12-31",
			changeFrequency: "yearly",
			priority: 0.8,
		},
		// Our pSEO pages:
		...searchLandingPages,
	];
}
