"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { isProductSaved } from "../actions/save.action";
import { SavedInfo } from "../types";

type Props = {
	productId: string;
	variantId: string;
	sizeId: string;
	initialState: SavedInfo;
};

const SaveProductSection = ({
	productId,
	variantId,
	sizeId,
	initialState,
}: Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const queryKey = ["save-info", productId];

	const { data } = useQuery<SavedInfo>({
		queryKey,
		queryFn: () => isProductSaved(productId),
		initialData: initialState,
		staleTime: Infinity,
	});

	const [isSaved, setIsSaved] = useState(initialState.isSavedByUser);

	useEffect(() => {
		if (data?.isSavedByUser !== undefined) {
			setIsSaved(data.isSavedByUser);
		}
	}, [data?.isSavedByUser]);

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const response = await axios.post("/api/save-product", {
				productId,
				variantId,
				sizeId,
			});
			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });

			const previousState = queryClient.getQueryData<SavedInfo>(queryKey);

			setIsSaved((prev) => !prev);
			queryClient.setQueryData<SavedInfo>(queryKey, {
				isSavedByUser: !previousState?.isSavedByUser,
			});

			return { previousState };
		},
		onSuccess: (result) => {
			if (result?.isSavedByUser !== undefined) {
				queryClient.setQueryData<SavedInfo>(queryKey, {
					isSavedByUser: result.isSavedByUser,
				});
				setIsSaved(result.isSavedByUser);
				toast.success(result.message);
			} else {
				toast.error("Unexpected error");
			}

			router.refresh();
		},
		onError: (error, _, context) => {
			// Rollback UI state on error
			setIsSaved(context?.previousState?.isSavedByUser ?? false);
			queryClient.setQueryData(queryKey, context?.previousState);
			toast.error("Failed to save product", { description: error.message });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	return (
		<div
			onClick={() => !isPending && mutate()}
			className={cn(
				"flex flex-col items-center justify-center shrink-0 size-10 p-2 rounded-full cursor-pointer transition-all",
				isSaved || initialState.isSavedByUser ? "bg-red-100" : "bg-slate-100"
			)}
		>
			<Heart
				className={cn(
					"size-5 transition-all",
					isSaved || initialState.isSavedByUser
						? "fill-red-500 text-red-500"
						: "text-gray-500"
				)}
			/>
		</div>
	);
};

export default SaveProductSection;
