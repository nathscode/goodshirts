"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

type Props = {};

const ClearFilters = () => {
	const router = useRouter();

	const clearAllFilters = () => {
		const url = "/products";
		router.push(url);
	};
	return (
		<div className="px-5 py-3 border-t">
			<Button onClick={clearAllFilters} variant="outline" className="w-full">
				Clear All Filters
			</Button>
		</div>
	);
};

export default ClearFilters;
