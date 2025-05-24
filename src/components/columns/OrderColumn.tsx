"use client";

import { OrderWithExtra } from "@/src/db/schema";
import { formatCurrency, formatDateTime } from "@/src/lib/utils";
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
		cell: ({ row }) => {
			// Check for registered user first, then fall back to guest user
			const firstName =
				row.original.user?.firstName ||
				row.original.guestUser?.firstName ||
				"N/A";
			const lastName =
				row.original.user?.lastName || row.original.guestUser?.lastName || "";
			return <span>{`${firstName} ${lastName}`}</span>;
		},
	},
	{
		accessorKey: "phoneNumber",
		header: "Customer Number",
		cell: ({ row }) => {
			// Check for registered user first, then fall back to guest user
			const phoneNumber =
				row.original.user?.phoneNumber ||
				row.original.guestUser?.phoneNumber ||
				"N/A";
			return <span>{phoneNumber}</span>;
		},
	},
	{
		accessorKey: "PaymentType",
		header: "Payment Type",
		cell: ({ row }) => <span>{`${row.original.paymentType} `}</span>,
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
		accessorKey: "created",
		header: "Created",
		cell: ({ row }) => <span>{formatDateTime(row.original.createdAt)}</span>,
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
