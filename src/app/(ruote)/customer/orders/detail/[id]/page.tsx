import OrderDetailCard from "@/components/card/OrderDetailCard";
import BackButton from "@/components/common/BackButton";

interface Props {
	params: {
		id: string;
	};
}

const OrderDetailPage = async ({ params }: Props) => {
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
					<h1 className="font-medium text-lg">Order No. 192939393974</h1>
					<p className="text-base text-gray-500">3 items</p>
					<p className="text-base text-gray-500">Total 40,000</p>

					<div className="flex flex-col w-full my-4">
						<h1 className="font-medium text-base uppercase">Items Ordered</h1>
						<div className="flex flex-col w-full mt-4">
							<OrderDetailCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default OrderDetailPage;
