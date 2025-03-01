import { OrderItemWithExtra } from "@/src/db/schema";
import { formatDayDate } from "@/src/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Badge from "../common/Badge";
import ProductPrice from "../common/ProductPrice";
import { buttonVariants } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
	order: OrderItemWithExtra;
	orderNumber: string;
	createdAt: string;
};

const OrderDetailCard = ({ order, createdAt }: Props) => {
	const src =
		order?.product?.medias?.[0]?.url ?? "/images/placeholder-image.png";
	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex justify-between items-center w-full">
				<div className="flex flex-col justify-start">
					<p className="text-sm text-black">On {formatDayDate(createdAt)}</p>
					<div className="block my-2">
						<Badge text={order.status!} status={order.status} />
					</div>
					<p>Maybe eligible for return within 7 days, check our policy.</p>
					<div className="flex justify-start items-start w-full mt-4">
						<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
							<Image
								className="object-cover w-full h-full rounded-md"
								src={src}
								alt={order.product.name}
								fill
							/>
						</div>
						<div className="justify-start ms-5 w-full">
							<div className="flex flex-col max-w-xs mt-0">
								<h1 className="text-base font-me leading-relaxed line-clamp-2 text-foreground">
									{order.product.name}
								</h1>
								<p className="text-sm text-gray-500 capitalize">
									QTY: {order.quantity}
								</p>
								<p className="text-sm inline-flex items-center space-x-2 text-gray-500 capitalize">
									<span>COLOR: {order.variant.color} </span>
									<Dot size={16} />
									<span>SIZE: {order.size.size} </span>
								</p>
								<p className="text-sm text-gray-500 mt-1">
									<ProductPrice
										price={Number(order.price)!}
										discountPrice={Number(order.discountPrice!)}
										priceClassName="text-sm sm:text-sm! text-gray-500 font-normal"
										discountPriceClassName="text-sm sm:text-sm! text-gray-500 font-normal"
									/>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="justify-end">
					<div className="flex flex-col space-y-2">
						<Link
							href={"/"}
							className={`${buttonVariants({
								variant: "default",
								size: "sm",
							})} rounded-none`}
						>
							Buy Again
						</Link>
						<Link
							href={`/customer/orders/track/${order.id}`}
							className={`${buttonVariants({
								variant: "link",
								size: "sm",
							})} rounded-none`}
						>
							See Track History
						</Link>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default OrderDetailCard;
