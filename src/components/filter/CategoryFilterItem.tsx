"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { CategoryType } from "@/src/db/schema";
import { Check } from "lucide-react";

interface CategoryFilterItemProps {
	category: CategoryType;
	selected?: boolean;
}

const CategoryFilterItem = ({
	category,
	selected,
}: CategoryFilterItemProps) => {
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
		<li
			className={twMerge(
				"inline-flex justify-between items-center capitalize p-2 cursor-pointer hover:bg-slate-100 w-full",
				selected
					? "text-white bg-black border-black font-semibold"
					: "text-card-foreground font-medium"
			)}
			onClick={handleClick}
		>
			<span>{category.name}</span>
			{selected && <Check className="size-4" />}
		</li>
	);
};

export default CategoryFilterItem;
