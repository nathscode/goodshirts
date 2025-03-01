"use client";
import { CollectionWithExtra } from "@/src/db/schema";
import { formatDate } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const CollectionColumns: ColumnDef<CollectionWithExtra>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Collection Name",
		cell: ({ row }) => <span>{row.original.name}</span>,
	},
	{
		accessorKey: "totalProducts",
		header: "Total Products",
		cell: ({ row }) => <span>{row.original.collectionProducts.length}</span>,
	},
	{
		accessorKey: "isActive",
		header: "Active",
		cell: ({ row }) => <span>{row.original.isActive ? "Yes" : "No"}</span>,
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => (
			<span>
				{row.original.startDate
					? formatDate(row.original.startDate.toString())
					: "N/A"}
			</span>
		),
	},
	{
		accessorKey: "endDate",
		header: "End Date",
		cell: ({ row }) => (
			<span>
				{row.original.endDate
					? formatDate(row.original.endDate.toString())
					: "N/A"}
			</span>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => (
			<span>{formatDate(row.original.createdAt.toString())}</span>
		),
	},
];
