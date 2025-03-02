"use client";

import { Skeleton } from "../ui/skeleton";

const CategoryMobileSkeleton = () => {
	return (
		<div className="flex justify-start items-center w-full">
			<div className="relative shrink-0 w-full h-[20px] overflow-hidden bg-slate-200 rounded-full animate-pulse">
				<Skeleton className="h-full w-full animate-pulse" />
			</div>
		</div>
	);
};

export default CategoryMobileSkeleton;
