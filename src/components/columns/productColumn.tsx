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
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => row.original.basePrice,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <ProductRowActions row={row} />,
	},
];
