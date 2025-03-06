import { getUserWishLists } from "@/src/actions/getUserWishLists";
import SavedCard from "@/src/components/card/SavedCard";
import BackButton from "@/src/components/common/BackButton";
import { QueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import React from "react";

type Props = {};

const CustomerSavePage = async (props: Props) => {
	const userSaved = await getUserWishLists();

	if (userSaved.status === "error") {
		return (
			<div className="flex flex-col items-center justify-center min-h-14 h-[40vh]">
				<AlertCircle className="w-20 h-20" />
				<p>{userSaved.message}</p>
			</div>
		);
	}
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["saved-data"],
		queryFn: () => JSON.parse(JSON.stringify(userSaved.data)),
	});

	return (
		<div className="flex flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">
						Saved ({userSaved.data!.length})
					</h1>
				</div>
				<div className="flex flex-col w-full my-4 gap-y-4">
					{userSaved.data!.length > 0 ? (
						userSaved.data!.map((saves: any) => (
							<SavedCard key={saves.id} saved={saves} />
						))
					) : (
						<h1 className="text-xl font-bold">No Item in your wishlists</h1>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomerSavePage;
