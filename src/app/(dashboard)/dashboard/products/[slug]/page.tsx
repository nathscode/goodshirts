import fetchProductBySlug from "@/src/actions/fetchProductBySlug";
import NotFound from "@/src/app/not-found";
import { VariantColumns } from "@/src/components/columns/VariantColumn";
import BackButton from "@/src/components/common/BackButton";
import { DataTable } from "@/src/components/common/DataTable";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface IParams {
	slug?: string;
}

const ProductDashboardDetails = async ({ params }: { params: IParams }) => {
	const { slug } = await params;
	if (!slug) return redirect("/dashboard/products");
	const product = await fetchProductBySlug(slug);
	if (!product) return <NotFound />;
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col justify-start w-full px-5 ">
				<div className="flex flex-col justify-start w-fit">
					<BackButton />
				</div>
				<div className="flex justify-end w-full">
					<Button asChild>
						<Link href={`/dashboard/products/${product.slug}/variant/new`}>
							Add Variant
						</Link>
					</Button>
				</div>
				<div className="flex flex-col justify-start">
					<h1 className="text-lg font-bold capitalize mb-1">{product.name}</h1>
					<p className="text-gray-500 text-base">{`${product.category.name}/${product.subCategory.name}`}</p>
					<Separator className="bg-gray-200 my-4" />
					<DataTable
						columns={VariantColumns}
						//@ts-ignore
						data={product.variants}
						searchKey="colors"
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductDashboardDetails;
