"use client";
import getAllCategories from "@/src/actions/getAllCategories";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import CategoryItem from "./CategoryItem";
import { usePathname, useSearchParams } from "next/navigation";
import CategorySkeleton from "../skeleton/CategorySkeleton";

type Props = {};

const CategoryList = (props: Props) => {
	const params = useSearchParams();
	const category = params.get("category");
	const pathname = usePathname();
	{
		const getCategories = async () => {
			const response = await getAllCategories();
			return response;
		};
		const { isPending, error, data } = useQuery({
			queryKey: ["categories"],
			queryFn: getCategories,
		});


	if (isPending) {
		return (
			<div className="flex flex-col sm:flex-row justify-center max-w-3xl lg:max-w-4xl mx-auto gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<CategorySkeleton />
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
						No category Yet.
					</p>
				</div>
			);
		}
		return (
			<ScrollArea className="w-full whitespace-nowrap my-4">
				<div className="inline-flex py-2 flex-none items-center justify-center w-full space-x-4 flex-nowrap overflow-x-scroll scrollbar-none">
					{data.map((item) => (
						<CategoryItem
							key={item.name}
							category={item}
							selected={category === item.name}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		);
	}
};

export default CategoryList;
