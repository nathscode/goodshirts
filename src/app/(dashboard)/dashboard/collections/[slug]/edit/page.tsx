import NotFound from "@/src/app/not-found";
import CollectionForm from "@/src/components/form/CollectionForm";
import { ProductWithExtra } from "@/src/db/schema";
import { baseURL } from "@/src/lib/constants";
import { redirect } from "next/navigation";

const EditCollection = async ({ params }: { params: { slug?: string } }) => {
	const { slug } = await params;
	if (!slug) return redirect("/dashboard/collections");
	console.log(slug);

	try {
		const [collectionRes, productsRes] = await Promise.all([
			fetch(`${baseURL}/collections/${slug}`),
			fetch(`${baseURL}/collections/products`),
		]);

		if (!collectionRes.ok) {
			if (collectionRes.status === 404) return <NotFound />;
			throw new Error("Failed to fetch collection");
		}

		if (!productsRes.ok) {
			throw new Error("Failed to fetch products");
		}

		const collection = await collectionRes.json();
		const allProducts: ProductWithExtra[] = await productsRes.json();

		const existingProductIds =
			collection.collectionProducts?.map((cp: any) => cp.product.id) || [];

		return (
			<div className="flex justify-center items-center flex-col w-full py-24">
				<div className="flex flex-col items-center justify-center w-full max-w-xl">
					<div className="container">
						<CollectionForm
							initialData={collection}
							products={allProducts}
							existingProductIds={existingProductIds}
						/>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Error in EditCollection:", error);
		return <div>Error loading collection data. Please try again.</div>;
	}
};

export default EditCollection;
