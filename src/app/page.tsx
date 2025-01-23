import Banner from "@/components/Banner";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import HomeCollection from "@/components/home/HomeCollection";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
	return (
		<>
			<MaxWidthWrapper>
				<div className="border-t border-b border-black py-4 mb-10 mx-auto text-center flex flex-col items-center w-full">
					<h1 className="text-2xl font-bold uppercase tracking-tight text-gray-900 sm:text-6xl font-dela">
						africagoodshirts
					</h1>
				</div>
				<Banner />
				<Suspense>
					<HomeCollection />
				</Suspense>
			</MaxWidthWrapper>
		</>
	);
}
