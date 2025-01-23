import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {};

const SavedCard = (props: Props) => {
	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex justify-start items-center w-full">
				<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
					<Image
						className="object-cover w-full h-full rounded-md"
						src={"/images/placeholder-image.png"}
						alt={"order"}
						fill
					/>
				</div>
				<div className="justify-start ms-5 w-full">
					<div className="flex flex-col max-w-xs mt-0">
						<h1 className="text-base font-me leading-relaxed line-clamp-2 text-foreground">
							Sweatshirt
						</h1>
						<p className="text-sm text-gray-500">Order No. 19292929292</p>

						<p className="text-sm text-black">40,000</p>
					</div>
				</div>
				<div className="justify-end">
					<Button variant={"default"} asChild>
						<Link href="/product/slug">Add to cart</Link>
					</Button>
				</div>
			</div>
		</Card>
	);
};

export default SavedCard;
