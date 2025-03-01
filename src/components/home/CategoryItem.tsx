"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { CategoryType } from "@/src/db/schema";

interface CategoryItemProps {
	category: CategoryType;
	selected?: boolean;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
	category,
	selected,
}) => {
	const router = useRouter();
	const params = useSearchParams();

	const handleClick = useCallback(() => {
		let currentQuery = {};

		if (params) {
			currentQuery = qs.parse(params.toString());
		}

		const updatedQuery: any = {
			...currentQuery,
			category: category.name,
		};

		if (params?.get("category") === category.name) {
			delete updatedQuery.category;
		}

		const url = qs.stringifyUrl(
			{
				url: "/products/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);

		router.push(url);
	}, [category.name, router, params]);

	return (
		<div
			className={twMerge(
				"hover:bg-black hover:text-white  flex justify-center items-center  rounded-full text-sm text-center flex-none shrink-0 px-4 py-1.5 cursor-pointer  border-2 border-black bg-card",
				selected
					? "text-white bg-black border-black font-semibold"
					: "text-card-foreground font-medium"
			)}
			onClick={handleClick}
		>
			<div className="flex flex-1 items-center justify-center gap-x-1 w-full">
				<span className="capitalize">{category.name}</span>
			</div>
		</div>
	);
};

export default CategoryItem;
