"use client";

import { CategoriesWithExtra } from "@/src/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const CategoryColumns: ColumnDef<CategoriesWithExtra>[] = [
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
		accessorKey: "subCategories", // Correct accessor
		header: "Sub Categories",
		cell: ({ row }) => {
			const subCategories = row.original.subCategories || [];
			return subCategories.length > 0
				? subCategories.map((sub) => sub.name).join(", ")
				: "No Subcategories";
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<Link
				href={`/dashboard/categories/${row.original.slug}`}
				className="hover:underline"
			>
				View
			</Link>
		),
	},
];
