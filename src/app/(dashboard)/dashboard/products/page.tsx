export const dynamic = "force-dynamic";
import getAllProducts from "@/src/actions/getAllProducts";
import { ProductColumns } from "@/src/components/columns/productColumn";
import { DataTable } from "@/src/components/common/DataTable";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {};
const ProductsPage = async (props: Props) => {
	const products = await getAllProducts();
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-10 py-5">
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Products</p>
					<Button asChild>
						<Link href="/dashboard/products/new">
							<Plus className="h-4 w-4 mr-2" />
							Create Product
						</Link>
					</Button>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<DataTable
					columns={ProductColumns}
					//@ts-ignore
					data={products}
					searchKey="name"
				/>
			</div>
		</div>
	);
};
export default ProductsPage;
