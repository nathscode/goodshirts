"use client";

import { OrderWithExtra } from "@/src/db/schema";
import { formatCurrency } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Badge from "../common/Badge";
import { buttonVariants } from "../ui/button";

export const OrderColumns: ColumnDef<OrderWithExtra>[] = [
	{
		accessorKey: "id",
		header: "id",
		cell: ({ row }) => (
			<Link
				href={`/dashboard/orders/${row.original.id}`}
				className="hover:underline"
			>
				{row.original.id}
			</Link>
		),
	},
	{
		accessorKey: "orderNumber",
		header: "Order Number",
		cell: ({ row }) => (
			<span className="uppercase">{`${row.original.orderNumber}`}</span>
		),
	},
	{
		accessorKey: "customer",
		header: "Customer",
		cell: ({ row }) => (
			<span>{`${row.original.user.firstName} ${row.original.user.lastName}`}</span>
		),
	},
	{
		accessorKey: "phoneNumber",
		header: "Customer Number",
		cell: ({ row }) => <span>{`${row.original.user.phoneNumber} `}</span>,
	},
	{
		accessorKey: "total",
		header: "Total",
		cell: ({ row }) => (
			<span>{formatCurrency(row.original.total.toString())}</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge status={row.original.status} text={row.original.status!} />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<Link
				className={buttonVariants({
					variant: "default",
					size: "sm",
				})}
				href={`/dashboard/orders/${row.original.id}`}
			>
				View
			</Link>
		),
	},
];
