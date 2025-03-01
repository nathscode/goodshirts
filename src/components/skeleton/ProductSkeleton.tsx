"use client";

import { Skeleton } from "../ui/skeleton";

const ProductSkeleton = () => {
	return (
		<div className="flex flex-col w-[270px]">
			<div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl animate-pulse">
				<Skeleton className="h-full w-full" />
			</div>
			<Skeleton className="mt-2 w-12 h-4 rounded-lg" />
			<Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
			<Skeleton className="mt-2 w-16 h-4 rounded-lg" />
		</div>
	);
};

export default ProductSkeleton;
