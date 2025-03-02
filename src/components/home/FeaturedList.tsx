"use client";
import getAllFeaturedProducts from "@/src/actions/getAllFeaturedProducts";
import { ProductWithExtra } from "@/src/db/schema";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "../skeleton/ProductSkeleton";
import FeaturedProductCard from "../card/FeaturedProductCard";

type Props = {};

const FeaturedList = (props: Props) => {
	{
		const getFeaturedProduct = async () => {
			const response = await getAllFeaturedProducts();
			return response;
		};
		const { isPending, error, data } = useQuery({
			queryKey: ["featured-product"],
			queryFn: getFeaturedProduct,
		});

		if (isPending) {
			return (
				<div className="flex flex-col sm:flex-row justify-center max-w-3xl lg:max-w-4xl mx-auto gap-4 my-5">
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
					<p className="font-semibold text-sm text-neutral-400">
						No Featured Product Yet.
					</p>
				</div>
			);
		}
		return (
			<div className="flex flex-col w-full">
				<div className="flex flex-col justify-center items-center text-center w-full mb-10">
					<h1 className="text-xl sm:text-2xl font-semibold uppercase font-dela">
						Featured Products
					</h1>
				</div>

				<div className="flex flex-wrap justify-center md:justify-start w-full gap-5">
					{data.map((item: ProductWithExtra) => (
						<FeaturedProductCard
							key={item.id}
							// @ts-ignore
							product={item}
						/>
					))}
				</div>
			</div>
		);
	}
};

export default FeaturedList;
