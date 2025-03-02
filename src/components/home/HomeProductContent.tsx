"use client";
import { ProductWithExtra } from "@/src/db/schema";
import { baseURL } from "@/src/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import ProductCard from "../card/ProductCard";
import ProductSkeleton from "../skeleton/ProductSkeleton";
import ProductCardFake from "../card/ProductCardFake";
import { useMediaQuery } from "usehooks-ts";

const HomeProductContent = () => {
	const fetchRecentProducts = async () => {
		let url = `/api/products/`;

		const response = await axios.get(url);
		return response.data;
	};

	const { isPending, error, data } = useQuery({
		queryKey: ["recentProducts"],
		queryFn: () => fetchRecentProducts(),
	});

	const products = data?.data;

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

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				Error retrieving recent products
			</div>
		);
	}

	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				No recent products found
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-wrap justify-center md:justify-start w-full gap-5 ">
				{products.map((item: ProductWithExtra) => (
					<ProductCard key={item.id} product={item} />
				))}
			</div>
			<div className="flex items-center justify-center mt-10 mb-5">
				<Link
					href="/products"
					className="rounded-full px-4 py-2 border hover:bg-slate-100 transition-all text-sm"
				>
					See more
				</Link>
			</div>
		</>
	);
};

export default HomeProductContent;
