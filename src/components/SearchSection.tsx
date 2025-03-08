"use client";

import { ArrowRight, Search, X } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";
import useSuggestion from "../hooks/use-suggestions";

type Props = {
	className?: string;
	onOpenChange: (open: boolean) => void;
};

const SearchSection = ({ className, onOpenChange }: Props) => {
	const router = useRouter();
	const params = useSearchParams();
	const [searchInput, setSearchInput] = useState("");
	const { suggestions, isLoading, error } = useSuggestion(searchInput);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handleClearInput = () => {
		setSearchInput("");
		handleSearch("");
	};

	const handleSearch = useCallback(
		(searchTerm: string) => {
			let currentQuery = {};
			if (params) {
				currentQuery = qs.parse(params.toString());
			}
			const updatedQuery: any = {
				...currentQuery,
				q: searchTerm,
			};

			if (!searchTerm) {
				delete updatedQuery.q;
			}
			const url = qs.stringifyUrl(
				{
					url: "/products/",
					query: updatedQuery,
				},
				{ skipNull: true }
			);
			router.push(url);
			onOpenChange(false);
		},
		[router, params]
	);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch(searchInput);
		}
	};

	const highlightMatch = (text: string, searchTerm: string) => {
		if (!searchTerm) return text;
		const regex = new RegExp(`(${searchTerm})`, "gi");
		return text.split(regex).map((part, index) =>
			regex.test(part) ? (
				<strong key={index} className="font-bold">
					{part}
				</strong>
			) : (
				part
			)
		);
	};

	return (
		<div className="flex flex-col">
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

			{isLoading && (
				<div className="mt-2 text-sm text-gray-500">Loading...</div>
			)}
			{error && <div className="mt-2 text-sm text-red-500">{error}</div>}
			{suggestions.length > 0 && (
				<ul className="flex flex-col w-full text-black mt-5">
					{suggestions.map((item, index) => {
						const displayName =
							item.name ||
							item?.name ||
							item.category?.name ||
							item.subCategory?.name;

						return (
							<li
								key={index}
								className="inline-flex p-2 text-black hover:bg-slate-100 cursor-pointer"
								onClick={() => handleSearch(displayName)}
							>
								{highlightMatch(displayName, searchInput)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default SearchSection;
