"use client";
import { ProductTypes } from "@/types";
import Image from "next/image";
import React from "react";
import placeholderImage from "/public/images/placeholder-image.png";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import AnimatedContent from "../ui/animated-content";

type Props = {
	product: ProductTypes;
};

const ProductCard = ({ product }: Props) => {
	return (
		<AnimatedContent
			distance={150}
			direction="vertical"
			reverse={false}
			config={{ tension: 80, friction: 20 }}
			initialOpacity={0.2}
			animateOpacity
			scale={1.1}
			threshold={0.2}
		>
			<Link
				href={`/product/${product.slug}`}
				className="w-[300px] sm:w-[250px] h-full  snap-center flex-col flex items-center flex-none cursor-pointer group rounded-tl-lg rounded-xl "
			>
				<div className="w-full h-[300px] relative overflow-hidden rounded-xl bg-slate-50 ">
					<Image
						fill
						className="object-cover object-center size-full transition-all aspect-square group-hover:scale-105"
						src={product.src ?? "/images/placeholder-image.png"}
						alt="Listing"
					/>
				</div>

				<div className="flex flex-col space-y-1 w-full my-4">
					<h1 className="text-base capitalize text-pretty text-black font-bold">
						{product.name}
					</h1>
					<p className="text-sm text-pretty text-gray-600 line-clamp-1">
						{product.description}
					</p>
					<h2 className="text-base text-pretty text-black font-bold">
						{formatCurrency(product.price)}
					</h2>
				</div>
			</Link>
		</AnimatedContent>
	);
};

export default ProductCard;
