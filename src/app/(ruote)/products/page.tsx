import FilterSection from "@/src/components/filter/FilterSection";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import BreadCrumbs from "@/src/components/common/BreadCrumbs";
import { BreadcrumbTypes } from "@/src/types";
import React from "react";
import ProductList from "./ProductList";

type Props = {};

const ProductsPage = async (props: Props) => {
	const lists: BreadcrumbTypes[] = [
		{
			name: `Clothing`,
			hasLink: false,
		},
	];
	return (
		<MaxWidthWrapper>
			<div className="relative px-2 md:px-10 py-5">
				<div className="mx-auto mt-10">
					<div className="flex items-center justify-start my-4">
						<BreadCrumbs lists={lists} />
					</div>
					<div className="flex flex-col w-full">
						<div className="flex flex-wrap justify-between w-full gap-y-5 sm:gap-0 mt-4">
							<div className="w-full md:w-1/4 px-2">
								<FilterSection />
							</div>
							<div className="w-full md:w-9/12 px-2">
								<ProductList />
							</div>
						</div>
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default ProductsPage;
