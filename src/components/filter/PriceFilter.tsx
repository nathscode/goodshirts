"use client";
import React, { useCallback, useState, useEffect } from "react";
import MultiRangeSlider from "../common/MultiRangeSlider";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "../ui/button";

type Props = {};

const PriceFilter = (props: Props) => {
	const [minPrice, setMinPrice] = useState<number | undefined>();
	const [maxPrice, setMaxPrice] = useState<number | undefined>();

	const router = useRouter();
	const params = useSearchParams();

	// Initialize minPrice and maxPrice from URL params
	useEffect(() => {
		if (params) {
			const currentMinPrice = params.get("minPrice");
			const currentMaxPrice = params.get("maxPrice");
			setMinPrice(currentMinPrice ? Number(currentMinPrice) : undefined);
			setMaxPrice(currentMaxPrice ? Number(currentMaxPrice) : undefined);
		}
	}, [params]);

	// Debounce the URL update to avoid rapid changes
	const handleFilter = useCallback(() => {
		let currentQuery: { [key: string]: any } = {};

		if (params) {
			currentQuery = qs.parse(params.toString());
		}

		const updatedQuery: { [key: string]: any } = {
			...currentQuery,
			minPrice,
			maxPrice,
		};

		// Remove minPrice and maxPrice if they are not set
		if (!minPrice) delete updatedQuery.minPrice;
		if (!maxPrice) delete updatedQuery.maxPrice;

		const url = qs.stringifyUrl(
			{
				url: "/products/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);

		// Use router.replace to avoid adding a new history entry
		router.replace(url, { scroll: false });
	}, [minPrice, maxPrice, router, params]);

	// Handle range changes from the slider
	const handleRangeChange = (range: { min: number; max: number }) => {
		setMinPrice(range.min);
		setMaxPrice(range.max);
	};

	return (
		<div className="flex flex-col w-full border rounded-md px-4">
			<Accordion type="single" collapsible>
				<AccordionItem value="item-3">
					<AccordionTrigger className="inline-flex">Price</AccordionTrigger>
					<AccordionContent>
						<div className="flex justify-start flex-col mt-4">
							<MultiRangeSlider
								min={10000}
								max={100000}
								onChange={handleRangeChange}
							/>
							<Button
								onClick={handleFilter}
								className="mt-4 w-full bg-black text-white hover:bg-gray-800"
							>
								Apply Price Filter
							</Button>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default PriceFilter;
