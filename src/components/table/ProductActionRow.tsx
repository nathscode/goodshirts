"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Link from "next/link";
import ProductActionItem from "../common/ProductActionItem";

interface ProductRowActionsProps<TData> {
	row: Row<TData>;
}

export function ProductRowActions<TData>({
	row,
}: ProductRowActionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontal />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>
					{/* @ts-ignore */}
					<Link href={`/dashboard/products/${row.original.slug}`}>View</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					{/* @ts-ignore */}
					<Link href={`/dashboard/products/${row.original.slug}/edit`}>
						{" "}
						Edit
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<ProductActionItem
						option="toggleActive"
						// @ts-ignore
						id={row.original.id}
						// @ts-ignore
						isActive={row.original.isActive!}
					/>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<ProductActionItem
						option="delete"
						// @ts-ignore
						id={row.original.id}
					/>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
