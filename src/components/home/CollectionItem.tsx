"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

interface CollectionItemProps {
	label: string;
	selected?: boolean;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
	label,
	selected,
}) => {
	const router = useRouter();
	const params = useSearchParams();

	const handleClick = useCallback(() => {
		let currentQuery = {};

		if (params) {
			currentQuery = qs.parse(params.toString());
		}

		const updatedQuery: any = {
			...currentQuery,
			collection: label,
		};

		if (params?.get("collection") === label) {
			delete updatedQuery.collection;
		}

		const url = qs.stringifyUrl(
			{
				url: "/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);

		router.push(url);
	}, [label, router, params]);

	return (
		<div
			className={twMerge(
				"hover:bg-black hover:text-white  flex justify-center items-center  rounded-full text-sm text-center flex-none shrink-0 px-4 py-1.5 cursor-pointer  border-2 border-black bg-card",
				selected
					? "text-white bg-black border-black font-semibold"
					: "text-card-foreground font-medium"
			)}
			onClick={handleClick}
		>
			<div className="flex flex-1 items-center justify-center gap-x-1 w-full">
				<span className="capitalize">{label}</span>
			</div>
		</div>
	);
};

export default CollectionItem;
