import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Badge from "../common/Badge";
import { OrderItemWithExtra } from "@/src/db/schema";

type Props = {
	order: OrderItemWithExtra;
};

const OrderReviewCard = ({ order }: Props) => {
	if (!order.product) {
		return null; // Prevent errors if product data is missing
	}

	const productImage =
		order.product.medias?.length > 0
			? order.product.medias[0].url
			: "/images/placeholder-image.png";

	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex flex-wrap justify-between items-center w-full">
				<div className="flex justify-start items-start sm:w-auto w-full">
					<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
						<Image
							className="object-cover w-full h-full rounded-md"
							src={productImage}
							alt={order.product.name}
							fill
						/>
					</div>
					<div className="justify-start ms-5 w-full">
						<div className="flex flex-col max-w-xs mt-0">
							<h1 className="text-base font-medium leading-relaxed line-clamp-2 text-foreground">
								{order.product.name}
							</h1>
							<p className="text-sm text-gray-500 uppercase">
								Order No. {order.order.orderNumber}
							</p>
							<div className="block my-2">
								<Badge text={order.status!} status={order.status} />
							</div>
							<p className="text-sm text-black">
								Delivered on {new Date(order.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>
				<div className="mt-5 sm:mt-0 flex justify-start sm:justify-end h-full w-full sm:w-auto space-x-2 items-end">
					<Button variant={"secondary"} asChild>
						<Link href={`/customer/reviews/detail/${order.id}`}>
							Rate this Product
						</Link>
					</Button>
				</div>
			</div>
		</Card>
	);
};

export default OrderReviewCard;
