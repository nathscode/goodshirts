"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isProductSaved } from "../actions/save.action";
import { SavedInfo } from "../types";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";

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

	// Fetch saved status
	const { data } = useQuery({
		queryKey,
		queryFn: () => isProductSaved(productId),
		initialData: initialState,
		staleTime: Infinity,
	});

	// Mutation to save/unsave product
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
			queryClient.setQueryData<SavedInfo>(queryKey, (old) => ({
				isSavedByUser: !old?.isSavedByUser,
			}));
			return { previousState };
		},
		onSuccess: (result) => {
			toast.success(result.message);
			router.refresh();
		},
		onError: (error, _, context) => {
			queryClient.setQueryData(queryKey, context?.previousState);
			toast.error("Failed to save product", { description: error.message });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	return (
		<div
			onClick={() => mutate()}
			className="flex flex-col items-center justify-center h-8 w-8 bg-slate-100 rounded-full hover:cursor-pointer transition-all"
		>
			<Heart
				className={cn(
					"size-4",
					data?.isSavedByUser && "fill-red-500 text-red-500"
				)}
			/>
		</div>
	);
};

export default SaveProductSection;
