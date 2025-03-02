export const dynamic = "force-dynamic";
import getAllCategories from "@/src/actions/getAllCategories";
import { CategoryColumns } from "@/src/components/columns/CategoryColumn";
import { DataTable } from "@/src/components/common/DataTable";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

const CategoryPage = async () => {
	const categories = await getAllCategories();
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-10 py-5">
				<div className="flex items-center justify-between">
					<p className="text-heading2-bold">Categories</p>
					<Button asChild>
						<Link href="/dashboard/categories/new">
							<Plus className="h-4 w-4 mr-2" />
							Create Categories
						</Link>
					</Button>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<DataTable
					columns={CategoryColumns}
					//@ts-ignore
					data={categories}
					searchKey="name"
				/>
			</div>
		</div>
	);
};
export default CategoryPage;
