"use client";
import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";

type Props = {};

const SortingFilter = (props: Props) => {
	const router = useRouter();
	const params = useSearchParams();

	// Handle sorting change
	const handleSortChange = useCallback(
		(sortValue: string) => {
			let currentQuery = {};
			if (params) {
				currentQuery = qs.parse(params.toString());
			}

			const updatedQuery: any = {
				...currentQuery,
				sort: sortValue,
			};

			// Remove the sort parameter if it is already selected
			if (params?.get("sort") === sortValue) {
				delete updatedQuery.sort;
			}

			const url = qs.stringifyUrl(
				{
					url: "/products/",
					query: updatedQuery,
				},
				{ skipNull: true }
			);

			router.replace(url, { scroll: false });
		},
		[params, router]
	);

	return (
		<div className="justify-end">
			<Select
				value={params?.get("sort") || ""}
				onValueChange={handleSortChange}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Popularity" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="popularity">Popularity</SelectItem>
					<SelectItem value="newest">Newest Arrival</SelectItem>
					<SelectItem value="lowest-price">Prices: Low to High</SelectItem>
					<SelectItem value="highest-price">Prices: High to Low</SelectItem>
					<SelectItem value="rating">Product Rating</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SortingFilter;
