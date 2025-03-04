// components/TopSellingProductTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import { formatCurrency } from "@/src/lib/utils";
import { getTopSellingProducts } from "@/src/actions/topSellingProducts";

type Product = {
	id: string;
	name: string;
	stock: number;
	totalSales: number;
	totalEarnings: number;
	growth: number;
};

const TopSellingProductTable = () => {
	const [topProducts, setTopProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getTopSellingProducts();
			setTopProducts(data);
		};
		fetchData();
	}, []);

	return (
		<section className="flex flex-col w-full bg-slate-50 shadow-md p-4 mt-5">
			<div className="flex flex-col item-center text-center justify-center w-full mb-4">
				<h4 className="text-lg font-semibold capitalize">
					Top selling products
				</h4>
			</div>
			<Table>
				<TableCaption>A list of your top selling products.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="whitespace-nowrap w-[30%]">Product</TableHead>
						<TableHead className="whitespace-nowrap">Stock</TableHead>
						<TableHead className="whitespace-nowrap">Total Sales</TableHead>
						<TableHead className="whitespace-nowrap">Total Earnings</TableHead>
						<TableHead className="whitespace-nowrap">Growth</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{topProducts.map((product) => (
						<TableRow key={product.id}>
							<TableCell className="font-medium whitespace-nowrap line-clamp-1 truncate">
								{product.name}
							</TableCell>
							<TableCell className="whitespace-nowrap">
								{product.stock.toLocaleString()}
							</TableCell>
							<TableCell className="whitespace-nowrap">
								{product.totalSales.toLocaleString()}
							</TableCell>
							<TableCell className="whitespace-nowrap">
								{formatCurrency(product.totalEarnings)}
							</TableCell>
							<TableCell
								className={`whitespace-nowrap
									${product.growth >= 0 ? "text-green-500" : "text-red-500"}
								`}
							>
								{product.growth.toFixed(1)}%
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</section>
	);
};

export default TopSellingProductTable;
