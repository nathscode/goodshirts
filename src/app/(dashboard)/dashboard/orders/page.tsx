import { getDashboardOrders } from "@/src/actions/getUserOrders";
import { OrderColumns } from "@/src/components/columns/OrderColumn";
import { DataTable } from "@/src/components/common/DataTable";
import { Separator } from "@/src/components/ui/separator";

type Props = {};
const OrderPage = async (props: Props) => {
	const orders = await getDashboardOrders();
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-5 sm:px-10 py-5">
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Orders {orders.length}</p>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<DataTable
					columns={OrderColumns}
					//@ts-ignore
					data={orders}
					searchKey="orderNumber"
				/>
			</div>
		</div>
	);
};
export default OrderPage;
