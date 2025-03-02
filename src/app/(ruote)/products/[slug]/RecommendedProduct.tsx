"use client";
import fetchProductByCategory from "@/src/actions/fetchProductByCategory";
import ProductCard from "@/src/components/card/ProductCard";
import Carousel from "@/src/components/common/Carousel";
import ProductSkeleton from "@/src/components/skeleton/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Props = {
	categoryId: string;
};

const RecommendedProduct = ({ categoryId }: Props) => {
	const getRecommendedProducts = async () => {
		const response = await fetchProductByCategory(categoryId);
		return response;
	};
	const { isPending, error, data } = useQuery({
		queryKey: ["recommended-products"],
		queryFn: getRecommendedProducts,
	});

	if (isPending) {
		return (
			<div className="flex flex-col sm:flex-row justify-start max-w-full gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<ProductSkeleton />
					</div>
				))}
			</div>
		);
	}

	if (error) return "An error has occurred: " + error.message;

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center space-y-3 max-w-3xl lg:max-w-4xl mx-auto pb-20">
				<p className="font-semibold text-sm text-neutral-400">Empty</p>
			</div>
		);
	}
	return (
		<Carousel title="Recommended" slideLength={data.length}>
			{data.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</Carousel>
	);
};

export default RecommendedProduct;
