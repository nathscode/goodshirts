"use client";

import { Loader2, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
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
import {
	deleteUserAddress,
	setDefaultAddress,
} from "@/src/actions/address.action";

interface AddressActionItemProps {
	option: "delete" | "toggleDefault";
	id: string;
	isDefault?: boolean;
}

const AddressActionItem: React.FC<AddressActionItemProps> = ({
	option,
	id,
	isDefault,
}) => {
	const mutationFn =
		option === "delete" ? deleteUserAddress : () => setDefaultAddress(id);

	const buttonText =
		option === "delete"
			? "Delete Address"
			: isDefault
				? "Remove Default"
				: "Set as Default";

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
				<Button
					className={
						option === "delete" ? "bg-red-500 text-white" : "font-semibold"
					}
				>
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : option === "delete" ? (
						<Trash className="h-4 w-4" />
					) : (
						<span>{buttonText}</span>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-white text-grey-1">
				<AlertDialogHeader>
					<AlertDialogTitle
						className={option === "delete" ? "text-red-1" : "text-blue-1"}
					>
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						{option === "delete"
							? "This will permanently delete your address."
							: isDefault
								? "This will remove this address as your default."
								: "This will set this address as your default."}
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
							: isDefault
								? "Remove Default"
								: "Set Default"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AddressActionItem;
