"use client";

import { Skeleton } from "../ui/skeleton";

const BannerSkeleton = () => {
	return (
		<div className="flex flex-col w-full h-[350px] sm:h-[500px]">
			<div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl animate-pulse">
				<Skeleton className="h-full w-full" />
			</div>
		</div>
	);
};

export default BannerSkeleton;
