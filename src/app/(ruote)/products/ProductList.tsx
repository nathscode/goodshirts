"use client";

import Pagination from "@/src/components/Pagination";
import ProductCardMini from "@/src/components/card/ProductCardMini";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import SortingFilter from "@/src/components/filter/SortingFilter";
import ProductSkeleton from "@/src/components/skeleton/ProductSkeleton";
import { ProductWithExtra } from "@/src/db/schema";
import { ITEM_PER_PAGE } from "@/src/lib/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Fetch products using Axios
const fetchProducts = async (
	queryString: string,
	page: number,
	limit: number
) => {
	// Construct URL with default pagination
	const url = queryString
		? `/api/products/query?${queryString}&page=${page}&limit=${limit}`
		: `/api/products/query?page=${page}&limit=${limit}`;

	const { data } = await axios.get<{
		products: ProductWithExtra[];
		pagination: {
			totalCount: number;
			page: number;
			pageSize: number;
			totalPages: number;
		};
	}>(url);

	return data;
};

const ProductList = () => {
	const searchParams = useSearchParams();
	const [queryString, setQueryString] = useState("");
	const [page, setPage] = useState<number>(1);
	const limit = ITEM_PER_PAGE;

	// Effect to update queryString when searchParams change
	useEffect(() => {
		const query = searchParams.toString();
		setQueryString(query);
	}, [searchParams]);

	// React Query for fetching products
	const {
		data: response,
		isPending,
		error,
		isFetching,
		isPlaceholderData,
	} = useQuery({
		queryKey: ["products-query", queryString, page],
		queryFn: () => fetchProducts(queryString, page, limit),
		placeholderData: keepPreviousData,
		enabled: queryString !== null, // Ensures request is made only when necessary
	});

	// Extract products and pagination metadata from response
	const products = response?.products || [];
	const pagination = response?.pagination;

	// Loading state
	if (isPending) {
		return (
			<div className="flex flex-col sm:flex-row justify-start max-w-sm gap-4 my-5">
				{Array.from({ length: limit }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<ProductSkeleton />
					</div>
				))}
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				Error retrieving products
			</div>
		);
	}

	// No products state
	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				No products found
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between w-full">
				<div className="justify-start">
					<h4 className="font-semibold text-base">{`${products.length} products found`}</h4>
				</div>
				<SortingFilter />
			</div>

			{/* Render products */}
			<div className="flex flex-wrap justify-center md:justify-start w-full gap-5">
				{products.map((item) => (
					<ProductCardMini key={item.id} product={item} />
				))}
			</div>

			{/* Pagination Controls */}
			{pagination && (
				<div className="flex items-center justify-center mt-10 mb-5">
					<Pagination
						currentPage={page}
						totalItems={pagination.totalPages}
						onPageChange={(page) => setPage(page)}
						isPreviousData={isPlaceholderData}
						itemPerPage={ITEM_PER_PAGE}
					/>

					{isFetching && <LoadingSpinner />}
				</div>
			)}
		</div>
	);
};

export default ProductList;
