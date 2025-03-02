import { OrderWithExtra } from "@/src/db/schema";
import { formatDayDate } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Badge from "../common/Badge";
import { buttonVariants } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
	order: OrderWithExtra;
};

const OrderCard = ({ order }: Props) => {
	const src =
		order?.items?.[0]?.product?.medias?.[0]?.url ??
		"/images/placeholder-image.png";

	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<Link href={`/customer/orders/detail/${order.id}`}>
				<div className="flex justify-start items-start w-full">
					<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
						<Image
							className="object-cover w-full h-full rounded-md"
							src={src}
							alt="order"
							fill
						/>
					</div>
					<div className="justify-start ms-5 w-full">
						<div className="flex flex-col max-w-xs mt-0">
							<h1 className="text-base font-medium leading-normal line-clamp-2 text-foreground">
								{order.items[0]?.product.name ?? "Unknown Product"}{" "}
								{/* Use `items` */}
							</h1>
							<p className="text-sm text-gray-500">
								Order No. {order.orderNumber}
							</p>
							<div className="block my-2">
								<Badge text={order.status!} status={order.status} />
							</div>
							<p className="text-sm text-black">
								On {formatDayDate(order.createdAt.toString())}
							</p>
						</div>
					</div>
					<div className="hidden sm:flex justify-end">
						<Link
							href={`/customer/orders/detail/${order.id}`}
							className={buttonVariants({
								variant: "ghost",
								size: "sm",
							})}
						>
							See Details
						</Link>
					</div>
				</div>
			</Link>
		</Card>
	);
};

export default OrderCard;
