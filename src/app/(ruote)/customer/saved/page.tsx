import { getUserWishLists } from "@/src/actions/getUserWishLists";
import SavedCard from "@/src/components/card/SavedCard";
import BackButton from "@/src/components/common/BackButton";
import React from "react";

type Props = {};

const CustomerSavePage = async (props: Props) => {
	const userSaved = await getUserWishLists();

	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Saved ({userSaved.length})</h1>
				</div>
				<div className="flex flex-col w-full my-4 gap-y-4">
					{userSaved.length > 0 ? (
						userSaved.map((saves: any) => (
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
