"use client";
import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/src/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { sizes } from "@/src/lib/constants";
import { Label } from "../ui/label";

type Props = {};

const SizeFilter = (props: Props) => {
	const router = useRouter();
	const params = useSearchParams();

	// Debounce the router.push call to avoid rapid updates
	const handleSizeChange = useCallback(
		(sizeValue: string) => {
			// Parse the current query parameters
			let currentQuery = {};
			if (params) {
				currentQuery = qs.parse(params.toString());
			}

			// Update the query with the new size
			const updatedQuery: any = {
				...currentQuery,
				size: sizeValue,
			};

			// If the size is already selected, remove it from the query
			if (params?.get("size") === sizeValue) {
				delete updatedQuery.size;
			}

			// Construct the new URL
			const url = qs.stringifyUrl(
				{
					url: "/products/",
					query: updatedQuery,
				},
				{ skipNull: true }
			);

			// Use router.replace to avoid adding a new history entry
			router.replace(url, { scroll: false }); // Disable scrolling to improve performance
		},
		[params, router]
	);

	return (
		<div className="flex flex-col w-full border rounded-md px-4">
			<Accordion type="single" collapsible>
				<AccordionItem value="item-2">
					<AccordionTrigger className="">Size</AccordionTrigger>
					<AccordionContent>
						<div className="flex justify-start flex-col mt-4">
							<RadioGroup
								className="flex justify-start items-center flex-wrap space-x-1"
								value={params?.get("size") || ""}
								onValueChange={handleSizeChange}
							>
								<div className="flex items-center flex-wrap gap-4">
									{sizes.length > 0 ? (
										sizes.map((size, index) => (
											<div key={`${size}-${index}`}>
												<RadioGroupItem
													className="peer sr-only"
													value={size}
													id={size}
												/>
												<Label
													htmlFor={size}
													className="flex items-center justify-between capitalize rounded-md border-2 border-gray-200 bg-popover p-4 hover:border-primary hover:cursor-pointer hover:text-black peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-primary"
												>
													{size}
												</Label>
											</div>
										))
									) : (
										<div>No sizes available for this color</div>
									)}
								</div>
							</RadioGroup>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default SizeFilter;
