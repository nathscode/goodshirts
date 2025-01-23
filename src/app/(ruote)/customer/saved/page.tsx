import SavedCard from "@/components/card/SavedCard";
import BackButton from "@/components/common/BackButton";
import React from "react";

type Props = {};

const CustomerSavePage = (props: Props) => {
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Saved (4)</h1>
				</div>
				<div className="flex flex-col w-full my-4">
					<SavedCard />
				</div>
			</div>
		</div>
	);
};

export default CustomerSavePage;
