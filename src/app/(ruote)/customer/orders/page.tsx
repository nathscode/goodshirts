import { getUserOrders } from "@/src/actions/getUserOrders";
import OrderCard from "@/src/components/card/OrderCard";
import BackButton from "@/src/components/common/BackButton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orders",
};
const CustomerOrderPage = async () => {
	const orders = await getUserOrders();

	// Separate orders into different categories
	const ongoingOrders = orders.filter(
		(order: any) => order.status === "PENDING" || order.status === "DELIVERED"
	);
	const cancelledOrders = orders.filter(
		(order: any) => order.status === "CANCELLED" || order.status === "RETURNED"
	);

	return (
		<div className="flex flex-col justify-start w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Orders</h1>
				</div>
				<div className="flex flex-col justify-start w-full">
					<Tabs defaultValue="ongoing" className="w-full my-5">
						<TabsList className="flex justify-start items-center bg-transparent text-foreground w-full">
							<TabsTrigger value="ongoing">
								Ongoing/Delivered ({ongoingOrders.length})
							</TabsTrigger>
							<TabsTrigger value="cancelled">
								Cancelled/Returned ({cancelledOrders.length})
							</TabsTrigger>
						</TabsList>
						<TabsContent value="ongoing">
							<div className="flex flex-col w-full my-4 gap-y-4">
								{ongoingOrders.length > 0 ? (
									ongoingOrders.map((order: any) => (
										<OrderCard key={order.id} order={order} />
									))
								) : (
									<h1 className="text-xl font-bold">No Ongoing Orders</h1>
								)}
							</div>
						</TabsContent>
						<TabsContent value="cancelled">
							<div className="flex flex-col w-full my-4">
								{cancelledOrders.length > 0 ? (
									cancelledOrders.map((order: any) => (
										<OrderCard key={order.id} order={order} />
									))
								) : (
									<h1 className="text-xl font-bold">No Cancelled Orders</h1>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default CustomerOrderPage;
