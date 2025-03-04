import { getDashboardOrdersById } from "@/src/actions/getUserOrdersById";
import NotFound from "@/src/app/not-found";
import BackButton from "@/src/components/common/BackButton";
import Badge from "@/src/components/common/Badge";
import OrderUpdate from "@/src/components/form/OrderStatusForm";
import { Separator } from "@/src/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import { formatCurrency } from "@/src/lib/utils";
import Link from "next/link";

interface IParams {
	orderId?: string;
}

const OrdersDetails = async ({ params }: { params: IParams }) => {
	const { orderId } = await params;
	const order = await getDashboardOrdersById(orderId!);
	if (!order) return <NotFound />;
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-10 py-5">
				<div className="flex items-center justify-start">
					<div className="flex flex-col justify-start w-fit">
						<BackButton />
					</div>
					<div className="flex space-x-2 text-lg font-bold">
						Order Number{" "}
						<span className="uppercase pl-2">{order.orderNumber}</span>
					</div>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<div className="flex flex-col w-full">
					<h2 className="text-lg font-bold uppercase my-2">Ordered Items</h2>
					<div className="flex flex-col w-full">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-1/5">Name</TableHead>
									<TableHead>Variant</TableHead>
									<TableHead>Qty</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Update</TableHead>
									<TableHead className="text-right">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{order.items.map((item) => (
									<TableRow>
										<TableCell className="font-medium capitalize whitespace-nowrap">
											{item.product.name}
										</TableCell>
										<TableCell className="whitespace-nowrap">{`${item.variant.color} ${item.size.size}`}</TableCell>
										<TableCell>{`${item.quantity}x${item.size.discountPrice ? item.size.discountPrice : item.size.price}`}</TableCell>
										<TableCell>
											{item.size.discountPrice
												? formatCurrency(
														Number(item.size.discountPrice) * item.quantity
													)
												: formatCurrency(
														Number(item.size.price) * item.quantity
													)}
										</TableCell>
										<TableCell>
											<Badge text={item.status!} status={item.status} />
										</TableCell>
										<TableCell>
											<OrderUpdate orderId={item.id} orderNumber={item.id} />
										</TableCell>
										<TableCell className="text-right">
											<Link
												className="font-semibold hover:underline"
												href={`/products/${item.product.slug}`}
											>
												View
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<ul className="flex flex-col w-full sm:w-1/3 my-5">
							<li className="inline-flex items-center justify-between w-full text-base py-1">
								<span className="text-zinc-500">Subtotal</span>
								<span>{formatCurrency(order.total.toString())}</span>
							</li>

							<li className="inline-flex items-center justify-between w-full text-base py-1">
								<span className="text-zinc-500">Shipping Fee</span>
								<span>
									{" "}
									{Number(order.shippingFee) > 0
										? formatCurrency(order.shippingFee.toString())
										: "Free"}
								</span>
							</li>
							<li className="inline-flex items-center justify-between w-full text-base mt-4">
								<strong className="">Grand Total</strong>
								<strong className="font-bold">
									{formatCurrency(order.grandTotal.toString())}
								</strong>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-wrap justify-between w-full mt-4">
					<div className="w-full md:w-1/2 px-2">
						<h2 className="text-lg font-bold uppercase my-2">
							Shipping information
						</h2>
						<div className="text-sm text-gray-500">
							<p className="text-sm capitalize text-gray-500 mt-1">
								{`${order.address?.fullName}`}
								<br />
								{`${order.address?.addressLine1}, ${order.address?.city}`},{" "}
								<br />
								{order.address?.state} State.
								<br />
								{order.address?.phoneNumber}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default OrdersDetails;
