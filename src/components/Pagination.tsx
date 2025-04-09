"use client";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo } from "react";

type Props = {
	currentPage: number;
	totalItems: number;
	itemPerPage: number;
	onPageChange: (page: number) => void;
	isPreviousData: boolean;
};

const Pagination = ({
	currentPage,
	totalItems,
	itemPerPage,
	onPageChange,
	isPreviousData,
}: Props) => {
	const totalPages = Math.ceil(totalItems / itemPerPage);

	const handlePrevClick = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNextClick = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	// Memoize the page numbers generation
	const pages = useMemo(() => {
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			// Show all pages if total pages are less than or equal to 7
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			// Always show the first page
			pages.push(1);

			// Determine if we need left ellipsis
			if (currentPage > 3) {
				pages.push("left-ellipsis");
			}

			// Calculate the range of pages to show around current page
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust if we're near the start or end
			if (currentPage <= 3) {
				endPage = 4;
			} else if (currentPage >= totalPages - 2) {
				startPage = totalPages - 3;
			}

			// Add the range pages
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Determine if we need right ellipsis
			if (currentPage < totalPages - 2) {
				pages.push("right-ellipsis");
			}

			// Always show the last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	}, [currentPage, totalPages]);

	return (
		<div className="flex justify-start items-center space-x-2 overflow-x-auto">
			<Button
				disabled={currentPage === 1 || isPreviousData}
				onClick={handlePrevClick}
				size="icon"
				variant="ghost"
				aria-label="Previous page"
			>
				<ArrowLeft className="h-5 w-5" />
			</Button>

			{pages.map((page) => {
				if (typeof page === "string") {
					return (
						<span
							key={page} // Unique key based on ellipsis position
							className="px-2 text-gray-500 select-none"
						>
							...
						</span>
					);
				}

				return (
					<Button
						key={`page-${page}`}
						size="icon"
						variant={currentPage === page ? "default" : "ghost"}
						onClick={() => onPageChange(page)}
						aria-current={currentPage === page ? "page" : undefined}
						aria-label={`Page ${page}`}
					>
						{page}
					</Button>
				);
			})}

			<Button
				disabled={currentPage === totalPages || isPreviousData}
				onClick={handleNextClick}
				size="icon"
				variant="ghost"
				aria-label="Next page"
			>
				<ArrowRight className="h-5 w-5" />
			</Button>
		</div>
	);
};

export default Pagination;
