import React from "react";
import { Metadata } from "next";
import ProductClient from "./ProductClient";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { BreadcrumbTypes } from "@/src/types";
import BreadCrumbs from "@/src/components/common/BreadCrumbs";
import { redirect } from "next/navigation";
import fetchProductBySlug from "@/src/actions/fetchProductBySlug";
import NotFound from "@/src/app/not-found";
import { ProductWithExtra } from "@/src/db/schema";

interface IParams {
	slug?: string;
}

export const generateMetadata = async ({
	params,
}: {
	params: IParams;
}): Promise<Metadata> => {
	const product: ProductWithExtra | null = await fetchProductBySlug(
		params.slug!
	);
	let urlImage = "";
	if (product?.medias && product.medias.length > 0) {
		urlImage = product.medias[0].url;
	}
	return {
		title: product?.name,
		description: product?.description,
		openGraph: {
			title: product?.name,
			description: product?.description!,
			url: `https://africagoodshirts.ng/products/${product?.slug}`,
			siteName: "Africagoodshirts",
			images: [
				{
					url: urlImage,
					width: 1200,
					height: 600,
				},
			],
		},
	};
};

const ProductDetailPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	if (!slug) return redirect("/");
	const product = await fetchProductBySlug(slug);
	if (!product) return <NotFound />;

	const lists: BreadcrumbTypes[] = [
		{
			name: "products",
			href: "/products",
			hasLink: true,
		},
		{
			name: `${product.category.name}`,
			href: `${product.category.slug}`,
			hasLink: true,
		},
		{
			name: `${product.subCategory.name}`,
			href: `${product.category.slug}/${product.subCategory.slug}`,
			hasLink: true,
		},
		{
			name: `${product.name}`,
			hasLink: false,
		},
	];
	return (
		<MaxWidthWrapper>
			<div className="relative px-2 md:px-10 py-5">
				<div className="flex items-center justify-start my-4">
					<BreadCrumbs lists={lists} />
				</div>
				<div className="mx-auto mt-10">
					<div className="flex flex-col w-full">
						<ProductClient product={product} />
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default ProductDetailPage;
