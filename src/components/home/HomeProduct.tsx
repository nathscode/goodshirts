import React, { Suspense } from "react";
import ProductSkeleton from "../skeleton/ProductSkeleton";
import HomeProductContent from "./HomeProductContent";

type Props = {};

const HomeProduct = (props: Props) => {
	return (
		<div className="flex flex-col w-full">
			<Suspense fallback={<ProductSkeleton />}>
				<HomeProductContent />
			</Suspense>
		</div>
	);
};

export default HomeProduct;
