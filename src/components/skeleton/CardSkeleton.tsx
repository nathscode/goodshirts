"use client";

import { Skeleton } from "../ui/skeleton";

const CardSkeleton = () => {
	return (
		<div className="flex justify-start items-center w-full">
			<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
				<Skeleton className="h-full w-full animate-pulse" />
			</div>
			<div className="justify-start ms-5 w-full">
				<Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
				<Skeleton className="mt-2 w-12 h-4 rounded-lg" />
				<Skeleton className="mt-2 w-16 h-4 rounded-lg" />
			</div>
		</div>
	);
};

export default CardSkeleton;
