"use client";

import { removeSavedProductAction } from "@/src/actions/save.action";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	productId: string;
};

const RemoveSaveButton = ({ productId }: Props) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const removeProduct = () => {
		startTransition(async () => {
			try {
				const result = await removeSavedProductAction(productId);
				if (result.status === "success") {
					router.refresh();
					toast.success("Product removed successfully");
				} else {
					toast.error(result.message || "An error occurred");
				}
			} catch (error) {
				toast.error("Failed to remove product");
			}
		});
	};

	return (
		<Button
			variant="secondary"
			className="font-semibold"
			onClick={removeProduct}
			disabled={isPending}
		>
			{isPending ? "Removing..." : "Remove"}
		</Button>
	);
};

export default RemoveSaveButton;
