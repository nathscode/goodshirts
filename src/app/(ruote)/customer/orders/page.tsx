import React from "react";
import BackButton from "@/components/common/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/card/OrderCard";

type Props = {};

const CustomerOrderPage = (props: Props) => {
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
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
							<TabsTrigger value="ongoing">Ongoing/Delivered (0)</TabsTrigger>
							<TabsTrigger value="cancelled">Cancelled/Returned</TabsTrigger>
						</TabsList>
						<TabsContent value="ongoing">
							<div className="flex flex-col w-full my-4">
								<OrderCard />
							</div>
						</TabsContent>
						<TabsContent value="cancelled">
							<div className="flex flex-col w-full my-4">
								<h1 className="text-xl font-bold">No Data Yet</h1>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default CustomerOrderPage;
