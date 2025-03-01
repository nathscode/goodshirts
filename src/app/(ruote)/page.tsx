import CollectionBanner from "@/src/components/CollectionBanner";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import CollectionList from "@/src/components/home/CollectionList";
import FeaturedList from "@/src/components/home/FeaturedList";
import HomeCollection from "@/src/components/home/HomeCollection";
import { Suspense } from "react";

export default function Home() {
	return (
		<>
			<MaxWidthWrapper>
				<div className="border-t border-b border-black py-4 mb-10 mx-auto text-center flex flex-col items-center w-full">
					<h1 className="text-2xl font-bold uppercase tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-dela hidden sm:flex">
						africagoodshirts
					</h1>
				</div>
				<CollectionList />
				<Suspense>
					<HomeCollection />
				</Suspense>
				<FeaturedList />
			</MaxWidthWrapper>
		</>
	);
}
