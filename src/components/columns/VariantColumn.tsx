"use client";

import { VariantsWithExtra } from "@/src/db/schema";
import { formatCurrency } from "@/src/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import VariantEditForm from "../form/VariantEditForm";
import DeleteVariant from "../common/DeleteVariant";

export const VariantColumns: ColumnDef<VariantsWithExtra>[] = [
	{
		accessorKey: "colors",
		header: "Colors",
		cell: ({ row }) => <span className="capitalize">{row.original.color}</span>,
	},
	{
		accessorKey: "variants", // Correct accessor
		header: "Variants",
		cell: ({ row }) => {
			const variantPrices = row.original.variantPrices || [];

			// Map through the variantPrices and format the display
			return variantPrices.length > 0 ? (
				<div className="space-y-1">
					{variantPrices.map((sub) => (
						<div key={sub.size}>
							<span className="font-medium">{sub.size}</span>:{" "}
							<span>{formatCurrency(sub.price)}</span>
							{sub.discountPrice && (
								<span className="text-sm text-gray-500 ml-1">
									({formatCurrency(sub.discountPrice)})
								</span>
							)}
						</div>
					))}
				</div>
			) : (
				"No Sizes"
			);
		},
	},
	{
		accessorKey: "stock", // Correct accessor
		header: "Stock",
		cell: ({ row }) => {
			const variantPrices = row.original.variantPrices || [];

			// Map through the variantPrices and format the display
			return variantPrices.length > 0 ? (
				<div className="space-y-1">
					{variantPrices.map((sub, index) => (
						<div key={index}>
							<span className="font-medium">{sub.stockQuantity}</span>{" "}
						</div>
					))}
				</div>
			) : (
				"No Sizes"
			);
		},
	},
	{
		accessorKey: "sku", // Correct accessor
		header: "Sku",
		cell: ({ row }) => <span className="font-medium">{row.original.sku}</span>,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const variantPrices = row.original.variantPrices || [];

			return variantPrices.length > 0 ? (
				<div className="space-y-1">
					{variantPrices.map((sub, index) => (
						<div key={index}>
							<VariantEditForm id={sub.id} />{" "}
							{/* Pass the correct variant ID */}
						</div>
					))}
				</div>
			) : (
				"No Sizes"
			);
		},
	},
	{
		accessorKey: "delete", // Correct accessor
		header: "Delete",
		cell: ({ row }) => <DeleteVariant id={row.original.id} option="variant" />,
	},
];
