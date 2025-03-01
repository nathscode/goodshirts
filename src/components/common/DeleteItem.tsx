"use client";

import { Loader2, Trash } from "lucide-react";

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
import { baseURL } from "@/src/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface DeleteProps {
	item: string;
	slug: string;
}

const DeleteItem: React.FC<DeleteProps> = ({ item, slug }) => {
	const itemType =
		item === "product"
			? "products"
			: item === "categories"
				? "categories"
				: "sub-categories";

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.delete(`${baseURL}/${itemType}/${slug}`); // Ensure the URL is correct
			return data;
		},
		onSuccess: (data) => {
			window.location.reload();
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
						<Trash className="h-4 w-4" />
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-white text-grey-1">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-red-1">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your{" "}
						{item}.
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

export default DeleteItem;
