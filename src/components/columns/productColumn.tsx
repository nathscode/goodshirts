"use client";

import { ProductType } from "@/src/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ProductRowActions } from "../table/ProductActionRow";

export const ProductColumns: ColumnDef<ProductType>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<Link
				href={`/dashboard/products/${row.original.slug}`}
				className="hover:text-brand"
			>
				{row.original.name}
			</Link>
		),
	},

	{
		accessorKey: "sku",
		header: "Sku",
		cell: ({ row }) => row.original.sku,
	},
	{
		accessorKey: "totalSales",
		header: "Total Sales",
		cell: ({ row }) => row.original.totalSales,
	},
	{
		accessorKey: "isActive",
		header: "Active",
		cell: ({ row }) => (
			<span>
				{row.original.isActive ? (
					<span className="px-2 py-1 bg-green-500 text-green-50 font-semibold  rounded-sm">
						Active
					</span>
				) : (
					<span className="px-2 py-1 bg-red-500 text-red-50  font-semibold rounded-sm">
						Inactive
					</span>
				)}
			</span>
		),
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <ProductRowActions row={row} />,
	},
];
