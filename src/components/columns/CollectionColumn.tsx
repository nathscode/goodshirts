"use client";
import { CollectionWithExtra } from "@/src/db/schema";
import { formatDate } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CollectionActionRow } from "../table/CollectionActionRow";

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
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <CollectionActionRow row={row} />,
	},
];
