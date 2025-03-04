"use client";

import {
	deleteCollection,
	setActivateCollection,
} from "@/src/actions/collection.action";
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
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface CollectionActionItemProps {
	option: "delete" | "toggleActive";
	id: string;
	isActive?: boolean;
}

const CollectionActionItem: React.FC<CollectionActionItemProps> = ({
	option,
	id,
	isActive: isActive,
}) => {
	const mutationFn =
		option === "delete" ? deleteCollection : () => setActivateCollection(id); // Use a wrapper function to ensure correct execution

	const buttonText =
		option === "delete"
			? "Delete Collection"
			: isActive
				? "Deactivate"
				: "Activate";

	const { mutate, isPending } = useMutation({
		mutationFn: async () => mutationFn(id),
		onSuccess: () => {
			window.location.reload();
			toast.success(
				`${option === "delete" ? "Deleted" : "Updated"} Successfully`
			);
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
							? "This will permanently delete your collection."
							: isActive
								? "This will deactivate this collection"
								: "This will activate this collection."}
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

export default CollectionActionItem;
