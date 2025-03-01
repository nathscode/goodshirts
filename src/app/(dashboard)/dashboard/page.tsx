import checkIsAdmin from "@/src/actions/checkIsAdmin";
import MetricBox from "@/src/components/dashboard/MetricBox";
import { Banknote, BoxesIcon, Tag, Users2 } from "lucide-react";
import { redirect } from "next/navigation";
import { orders, products, users } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import db from "@/src/db";

type Props = {};

const OverviewPage = async (props: Props) => {
	const isAdmin = await checkIsAdmin();
	if (!isAdmin) {
		return redirect("/");
	}
	const [totalOrders, totalRevenue, totalProducts, totalCustomers] =
		await Promise.all([
			db.select({ count: sql`COUNT(*)` }).from(orders),
			db.select({ sum: sql`SUM(total)` }).from(orders),
			db.select({ count: sql`COUNT(*)` }).from(products),
			db
				.select({ count: sql`COUNT(*)` })
				.from(users)
				.where(eq(users.role, "CUSTOMER")),
		]);

	return (
		<div className="flex flex-col w-full p-5">
			<h1 className=" text-xl md:text-2xl font-extrabold tracking-tight mb-1">
				Overview
			</h1>
			<section className="relative w-full">
				<div className="grid gird-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-5">
					<MetricBox
						title="orders"
						icon={<BoxesIcon className="size-7" />}
						metric={Number(totalOrders[0].count || 0)}
					/>
					<MetricBox
						title="revenue"
						icon={<Banknote className="size-7" />}
						metric={Number(totalRevenue[0].sum || 0)}
						isMoney={true}
					/>
					<MetricBox
						title="products"
						icon={<Tag className="size-7" />}
						metric={Number(totalProducts[0].count || 0)}
					/>
					<MetricBox
						title="customers"
						icon={<Users2 className="size-7" />}
						metric={Number(totalCustomers[0].count || 0)}
					/>
				</div>
			</section>
			<div className="flex flex-wrap w-full justify-start mt-5">
				<div className="w-full md:w-3/4 md:pr-5">
					<div className="flex flex-col flex-1 w-full bg-slate-50 shadow-md h-[400px]"></div>
				</div>
				<div className="w-full md:w-1/4">
					<div className="flex flex-col flex-1 w-full bg-slate-50 shadow-md h-[200px]"></div>
				</div>
			</div>
			<section className="flex flex-col w-full bg-slate-50 shadow-md p-4 mt-5"></section>
		</div>
	);
};

export default OverviewPage;
