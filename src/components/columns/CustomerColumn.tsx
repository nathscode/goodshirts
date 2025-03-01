"use client";

import { UserWithOrderTotal } from "@/src/actions/getAllCustomer";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const CustomerColumns: ColumnDef<UserWithOrderTotal>[] = [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => row.index + 1,
	},

	{
		accessorKey: "customer",
		header: "Customer",
		cell: ({ row }) => (
			<span>{`${row.original.firstName} ${row.original.lastName}`}</span>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <span>{row.original.email}</span>,
	},
	{
		accessorKey: "phoneNumber",
		header: "Phone Number",
		cell: ({ row }) => <span>{row.original.phoneNumber}</span>,
	},
	{
		accessorKey: "totalSpent",
		header: "Total Spent",
		cell: ({ row }) => (
			<span>{formatCurrency(row.original.totalSpent.toString())}</span>
		),
	},
	{
		accessorKey: "JoinedAt",
		header: "Joined At",
		cell: ({ row }) => (
			<span>{formatDate(row.original.createdAt.toString())}</span>
		),
	},
];
