"use client";

import { setProductFeatured } from "@/src/actions/products.action";
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

interface FeaturedProductActionProps {
	id: string;
	isFeatured?: boolean;
}

const FeaturedProductAction: React.FC<FeaturedProductActionProps> = ({
	id,
	isFeatured: isFeatured,
}) => {
	const buttonText = isFeatured ? "Remove Featured" : "Set as Featured";

	const { mutate, isPending } = useMutation({
		mutationFn: async () => setProductFeatured(id),
		onSuccess: () => {
			toast.success("Updated Successfully");
		},
		onError: (err: any) => {
			toast.error("An error occurred", {
				description: err.message || "Server error",
			});
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="font-semibold" variant={"secondary"}>
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<span>{buttonText}</span>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-white text-grey-1">
				<AlertDialogHeader>
					<AlertDialogTitle className={"text-blue-100"}>
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						{isFeatured
							? "This will remove this product as your featured."
							: "This will set this product as your featured."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-black" onClick={() => mutate()}>
						{isFeatured ? "Remove Featured" : "Set Featured"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default FeaturedProductAction;
