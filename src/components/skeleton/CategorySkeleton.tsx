"use client";

import { Skeleton } from "../ui/skeleton";

const CategorySkeleton = () => {
	return (
		<div className="flex justify-start items-center w-full">
			<div className="relative shrink-0 w-[70px] h-[40px] sm:w-[100px] overflow-hidden bg-slate-200 rounded-full animate-pulse">
				<Skeleton className="h-full w-full animate-pulse" />
			</div>
		</div>
	);
};

export default CategorySkeleton;
