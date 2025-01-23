import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Badge from "../common/Badge";

type Props = {};

const OrderDetailCard = (props: Props) => {
	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex justify-between items-center w-full">
				<div className="flex flex-col justify-start">
					<p className="text-sm text-black">On Thursday, 23-01-2024</p>
					<div className="block my-2">
						<Badge text="delivered" status="DELIVERED" />
					</div>
					<p>Maybe eligible for return within 7 days, check our policy.</p>
					<div className="flex justify-start items-start w-full mt-4">
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
								<p className="text-sm text-gray-500">QTY: 1</p>
								<p className="text-sm text-gray-500 mt-1">40,000</p>
							</div>
						</div>
					</div>
				</div>
				<div className="justify-end">
					<div className="flex flex-col">
						<Button asChild>
							<Link href={"/"}>Buy Again</Link>
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default OrderDetailCard;
