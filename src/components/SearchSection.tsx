"use client";

import { ArrowRight, Search, X } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";

type Props = {
	className?: string;
};

const SearchSection = ({ className }: Props) => {
	const router = useRouter();
	const params = useSearchParams();
	const [searchInput, setSearchInput] = useState("");

	// Handle search input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	// Clear the search input and URL query
	const handleClearInput = () => {
		setSearchInput("");
		handleSearch(""); // Trigger search with an empty query
	};

	// Debounced search submission
	const handleSearch = useCallback(
		(searchTerm: string) => {
			let currentQuery = {};

			// Parse the current query parameters
			if (params) {
				currentQuery = qs.parse(params.toString());
			}

			// Update the query with the search term
			const updatedQuery: any = {
				...currentQuery,
				q: searchTerm, // Add the search term to the query
			};

			// Remove the search term if the input is empty
			if (!searchTerm) {
				delete updatedQuery.q;
			}

			// Construct the new URL
			const url = qs.stringifyUrl(
				{
					url: "/products/",
					query: updatedQuery,
				},
				{ skipNull: true }
			);

			// Navigate to the new URL
			router.push(url);
		},
		[router, params]
	);

	// Trigger search on "Enter" key press
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch(searchInput);
		}
	};

	// Debounce the search input
	// useEffect(() => {
	// 	const debounceTimeout = setTimeout(() => {
	// 		handleSearch(searchInput);
	// 	}, 500); // 500ms debounce delay

	// 	return () => clearTimeout(debounceTimeout);
	// }, [searchInput, handleSearch]);

	return (
		<div
			className={`relative flex items-center ${className} w-[300px] h-10 rounded-lg focus-within:border-gray-800 border border-slate-400 bg-white overflow-hidden`}
		>
			<div className="grid place-items-center h-full w-12 text-gray-300">
				{searchInput ? (
					<X className="size-4 cursor-pointer" onClick={handleClearInput} />
				) : (
					<Search className="size-4" />
				)}
			</div>
			<input
				className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
				type="text"
				id="search"
				placeholder="Search products and categories.."
				value={searchInput}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
			/>
			<Button
				onClick={() => handleSearch(searchInput)}
				variant={"ghost"}
				size={"icon"}
			>
				<ArrowRight className="size-5" />
			</Button>
		</div>
	);
};

export default SearchSection;
