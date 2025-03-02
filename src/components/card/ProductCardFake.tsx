"use client";
import { ProductWithExtra } from "@/src/db/schema";
import { formatCurrency } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "../ui/animated-content";
import ProductPrice from "../common/ProductPrice";

const ProductCardFake = () => {
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
				href={`/products/men's-casual-pants-slim-pants`}
				className="w-[300px] sm:w-[280px] h-full  snap-center flex-col flex items-center flex-none cursor-pointer group rounded-tl-lg rounded-xl "
			>
				<div className="w-full h-[300px] relative overflow-hidden rounded-xl bg-slate-50 ">
					<Image
						fill
						className="object-cover object-center size-full transition-all aspect-square group-hover:scale-105"
						src={"/images/placeholder-image.png"}
						alt="Listing"
					/>
				</div>

				<div className="flex flex-col space-y-1 w-full my-4">
					<h1 className="text-base line-clamp-2 capitalize text-pretty text-black font-bold">
						men's casual pants slim pants
					</h1>
					<p className="text-sm text-pretty text-gray-600 line-clamp-1">
						men's casual pants slim pants
					</p>
					<ProductPrice
						price={Number(30000)}
						discountPrice={Number(25000)}
						priceClassName="font-bold"
						containerClassName="font-bold"
					/>
				</div>
			</Link>
		</AnimatedContent>
	);
};

export default ProductCardFake;
