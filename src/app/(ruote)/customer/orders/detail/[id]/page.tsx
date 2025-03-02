import { getUserOrdersById } from "@/src/actions/getUserOrdersById";
import NotFound from "@/src/app/not-found";
import OrderDetailCard from "@/src/components/card/OrderDetailCard";
import BackButton from "@/src/components/common/BackButton";
import { formatCurrency } from "@/src/lib/utils";
import { Metadata } from "next";

interface Props {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "Order Details",
};

const OrderDetailPage = async ({ params }: Props) => {
	const { id } = await params;
	const order = await getUserOrdersById(id);

	if (!order) return <NotFound />;
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start">
						<BackButton />
					</div>
					<h1 className="text-xl font-medium">Orders Details</h1>
				</div>
				<div className="flex flex-col justify-start w-full mt-4">
					<h1 className="font-medium text-base sm:text-lg">
						Order No. {order.orderNumber}
					</h1>
					<p className="text-base text-gray-500">{order.items.length} items</p>
					<p className="text-base text-gray-500">
						Total {formatCurrency(order.grandTotal)}
					</p>

					<div className="flex flex-col w-full my-4">
						<h1 className="font-medium text-base uppercase">Items Ordered</h1>
						<div className="flex flex-col w-full gap-y-4 mt-4">
							{order.items.map((item) => (
								<OrderDetailCard
									key={item.id}
									order={item}
									orderNumber={order.orderNumber}
									createdAt={order.createdAt.toString()}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default OrderDetailPage;
