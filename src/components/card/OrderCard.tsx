import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Badge from "../common/Badge";

type Props = {};

const OrderCard = (props: Props) => {
	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex justify-start items-start w-full">
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
						<div className="block my-2">
							<Badge text="pending" status="PENDING" />
						</div>
						<p className="text-sm text-black">On Thursday, 23-01-2024</p>
					</div>
				</div>
				<div className="justify-end">
					<Button variant={"ghost"} asChild>
						<Link href="/customer/orders/detail/0393939399">See Details</Link>
					</Button>
				</div>
			</div>
		</Card>
	);
};

export default OrderCard;
