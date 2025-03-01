"use client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { savedProductAction } from "../actions/saveProduct";

type Props = {
	productId: string;
	isSaved: boolean;
};

const SaveProductSection = ({ productId, isSaved }: Props) => {
	const router = useRouter();
	const [isLoading, startTransition] = useTransition();

	console.log({ isSaved });

	function SaveProduct() {
		startTransition(async () => {
			const result = await savedProductAction({ productId: productId });
			if (result.status === "success") {
				toast.success(`${result.message}`);
			} else {
				toast.error("An error occurred", { description: result.message });
				console.log(result.message);
			}
			router.refresh();
		});
	}

	return (
		<div
			onClick={() => SaveProduct()}
			className="flex flex-col items-center justify-center h-8 w-8 bg-slate-100 rounded-full hover:cursor-pointer transition-all"
		>
			<Heart
				className={`h-6 w-6  ${
					isSaved ? "fill-red-500 text-red-500" : "fill-gray-500"
				} 
                `}
			/>

			<span className="ml-2">
				{isLoading ? "Saving" : isSaved ? "Saved" : "Save"}
			</span>
		</div>
	);
};

export default SaveProductSection;
