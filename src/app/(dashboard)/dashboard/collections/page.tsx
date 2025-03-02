export const dynamic = "force-dynamic";
import { getAllCollections } from "@/src/actions/collection.action";
import { CollectionColumns } from "@/src/components/columns/CollectionColumn";
import { DataTable } from "@/src/components/common/DataTable";
import { Separator } from "@/src/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

const CollectionPage = async () => {
	const collections = await getAllCollections();
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-10 py-5">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">
						Collections {collections.length}
					</p>
					<Link className={"button"} href="/dashboard/collections/new">
						<Plus className="h-4 w-4 mr-2" />
						Create Collection
					</Link>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<DataTable
					columns={CollectionColumns}
					data={collections}
					searchKey="name"
				/>
			</div>
		</div>
	);
};
export default CollectionPage;
