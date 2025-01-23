"use client";
import React from "react";
import { Heading } from "../Heading";
import CollectionItem from "./CollectionItem";
import { usePathname, useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "../card/ProductCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {};
const collections = [
	{ label: "Shirts" },
	{ label: "sweatshirt" },
	{ label: "Trousers" },
	{ label: "Cap" },
	{ label: "Shoes" },
];

const HomeCollection = (props: Props) => {
	const params = useSearchParams();
	const collection = params.get("collection");
	const pathname = usePathname();
	const isMainPage = pathname === "/";
	return (
		<section className="flex flex-col w-full py-20">
			<Heading
				title="MEN COLLECTION"
				subtitle="Find anything you need and feel your best, shop the men' latest fashion and lifestyle products."
			/>
			<ScrollArea className="w-full whitespace-nowrap my-4">
				<div className="inline-flex py-2 flex-none items-center justify-center w-full space-x-4 flex-nowrap overflow-x-scroll scrollbar-none">
					{collections.map((item) => (
						<CollectionItem
							key={item.label}
							label={item.label}
							selected={collection === item.label}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<div className="flex flex-col pt-5 w-full">
				<div className="flex flex-wrap justify-center gap-4 w-full">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeCollection;
