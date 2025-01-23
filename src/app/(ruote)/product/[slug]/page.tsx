import React from "react";
import { Metadata } from "next";
import ProductClient from "./ProductClient";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { BreadcrumbTypes } from "@/types";
import BreadCrumbs from "@/components/common/BreadCrumbs";

const ProductDetailPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	const lists: BreadcrumbTypes[] = [
		{
			name: "products",
			href: "/menu",
			hasLink: true,
		},
		{
			name: `sweatshirt`,
			href: `/category/slug`,
			hasLink: true,
		},
		{
			name: `sweatshirt`,
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
						<ProductClient />
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default ProductDetailPage;
