"use client";

import { Loader2, Trash } from "lucide-react";

import {
	deletePriceVariant,
	deleteVariant,
} from "@/src/actions/variant.action";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface DeleteProps {
	id: string;
	option: "variant" | "priceVariant";
}

const DeleteVariant: React.FC<DeleteProps> = ({ id, option }) => {
	const router = useRouter();

	const mutationFn =
		option === "variant" ? deleteVariant : () => deletePriceVariant(id);
	const { mutate, isPending } = useMutation({
		mutationFn: async () => mutationFn(id),
		onSuccess: (data) => {
			router.refresh();
			toast.success("Deleted Successfully");
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	const handleDelete = () => {
		mutate();
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="bg-red-500 text-white">
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<span className="inline-flex items-center space-x-2">
							<Trash className="h-4 w-4" />
							<span>delete</span>
						</span>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-white text-grey-1">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-red-1">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						variant
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-500 text-white"
						onClick={handleDelete}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteVariant;
