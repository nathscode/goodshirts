import { getUserOrderItemById } from "@/src/actions/getUserItemOrder";
import NotFound from "@/src/app/not-found";
import BackButton from "@/src/components/common/BackButton";
import { formatDate } from "@/src/lib/utils";
import { OrderStatus } from "@/src/types";
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
	const order = await getUserOrderItemById(id);

	if (!order) return <NotFound />;
	const serverStatus: string = order.status?.toLowerCase() ?? "";

	const currentStatusIndex = OrderStatus.findIndex(
		(status) => status.text === serverStatus
	);

	const isInProgress = currentStatusIndex > 0;

	return (
		<div className="flex h-screen flex-col justify-start w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start">
						<BackButton />
					</div>
					<h1 className="text-xl font-medium">Orders Details</h1>
				</div>
				<div className="flex flex-col w-full my-4">
					<h2 className="text-base uppercase font-semibold my-4 bg-neutral-200 p-2 w-full">
						Order Progress
					</h2>
					<div>
						<h2 className="sr-only">Steps</h2>
						<ol
							className={`relative pl-10 text-gray-500 border-s ${
								isInProgress ? "border-green-500" : "border-gray-200"
							}`}
						>
							{OrderStatus.map((status, index) => {
								const isCompleted = index <= currentStatusIndex;
								const isDelivered = status.text === "delivered";

								return (
									<li key={status.id} className="mb-10 ms-6">
										<span
											className={`absolute flex items-center justify-center w-8 h-8 ${
												isCompleted ? "bg-green-200" : "bg-gray-100"
											} rounded-full -start-4 ring-4 ring-white`}
										>
											{isDelivered ? (
												// 🚗 Car icon when delivered
												<svg
													className="w-4 h-4 text-green-500"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="2"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M2 12h2l3 9h10l3-9h2"
													/>
													<circle cx="7" cy="19" r="2" />
													<circle cx="17" cy="19" r="2" />
													<path d="M5 12V9a7 7 0 0114 0v3" />
												</svg>
											) : (
												// ✅ Checkmark icon for all other statuses
												<svg
													className={`w-3.5 h-3.5 ${
														isCompleted ? "text-green-500" : "text-gray-500"
													}`}
													aria-hidden="true"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 16 12"
												>
													<path
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M1 5.917 5.724 10.5 15 1.5"
													/>
												</svg>
											)}
										</span>
										<h3 className="font-medium capitalize leading-tight">
											{status.text}
										</h3>
										<p className="text-sm">
											{formatDate(String(order.createdAt))}
										</p>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailPage;
