import fetchProductBySlug from "@/src/actions/fetchProductBySlug";
import NotFound from "@/src/app/not-found";
import ProductForm from "@/src/components/form/ProductForm";
import { redirect } from "next/navigation";

interface IParams {
	slug?: string;
}
const EditProduct = async ({ params }: { params: IParams }) => {
	const { slug } = await params;
	if (!slug) return redirect("/dashboard/products");
	const product = await fetchProductBySlug(slug);

	if (!product) return <NotFound />;

	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-xl">
				<div className="container">
					<ProductForm initialData={product} />
				</div>
			</div>
		</div>
	);
};

export default EditProduct;
