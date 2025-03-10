"use client";

import {
	deleteProduct,
	setActivateProduct,
} from "@/src/actions/products.action";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface ProductActionItemProps {
	option: "delete" | "toggleActive";
	id: string;
	isActive?: boolean;
}

const ProductActionItem: React.FC<ProductActionItemProps> = ({
	option,
	id,
	isActive: isActive,
}) => {
	const router = useRouter();
	const mutationFn =
		option === "delete" ? deleteProduct : () => setActivateProduct(id);
	const buttonText =
		option === "delete"
			? "Delete Product"
			: isActive
				? "Deactivate"
				: "Activate";

	const { mutate, isPending } = useMutation({
		mutationFn: async () => mutationFn(id),
		onSuccess: (data) => {
			if (data.status === "error") {
				toast.error("An error occurred", { description: data.message });
				return;
			}
			router.refresh();
			toast.success("Deleted Successfully");
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || err.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} className="w-full p-0 pl-2 justify-start">
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : option === "delete" ? (
						<span>Delete</span>
					) : (
						<span>{buttonText}</span>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-white text-grey-1">
				<AlertDialogHeader>
					<AlertDialogTitle
						className={option === "delete" ? "text-red-500" : "text-black"}
					>
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						{option === "delete"
							? "This will permanently delete your product."
							: isActive
								? "This will deactivate this product"
								: "This will activate this product."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={option === "delete" ? "bg-red-500" : "bg-black"}
						onClick={() => mutate()}
					>
						{option === "delete"
							? "Delete"
							: isActive
								? "Deactivate"
								: "Activate"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ProductActionItem;
