import { MoveRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { CollectionType } from "../db/schema";
type Props = {
	collection: CollectionType;
};

const CollectionBanner = ({ collection }: Props) => {
	return (
		<div className="relative h-[350px] sm:h-[500px]">
			<div className="absolute inset-0 flex flex-col justify-center h-full">
				<Image
					src={collection.image}
					className=" object-cover w-full h-full rounded-2xl"
					alt=""
					height={500}
					width={1200}
				/>
			</div>

			<div className="relative bg-gray-900 bg-opacity-75 rounded-2xl h-full">
				<div className="px-4  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 h-full flex flex-col justify-end">
					<div className="flex flex-col justify-start w-full relative bottom-10">
						<div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
							<h2 className="max-w-lg mb-6 font-dela text-2xl font-bold tracking-tight text-white uppercase sm:text-4xl">
								{collection.name}
							</h2>
							<p className="max-w-xl mb-5 text-base text-slate-200 md:text-lg">
								{collection.description}
							</p>
						</div>
						<div className="flex w-full justify-end items-end ">
							<Button variant={"secondary"} asChild>
								<Link
									href="/"
									aria-label=""
									className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-teal-accent-400 hover:text-teal-accent-700"
								>
									Buy Now
									<MoveRight className="size-3" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CollectionBanner;
