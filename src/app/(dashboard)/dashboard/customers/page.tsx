export const dynamic = "force-dynamic";
import { getAllCustomer } from "@/src/actions/getAllCustomer";
import { CustomerColumns } from "@/src/components/columns/CustomerColumn";
import { DataTable } from "@/src/components/common/DataTable";
import { Separator } from "@/src/components/ui/separator";

const CustomerPage = async () => {
	const customers = await getAllCustomer();
	return (
		<div className="flex flex-col w-full bg-white">
			<div className="px-10 py-5">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Customers {customers.length}</p>
				</div>
				<Separator className="bg-gray-200 my-4" />
				<DataTable
					columns={CustomerColumns}
					data={customers}
					searchKey="firstName"
				/>
			</div>
		</div>
	);
};
export default CustomerPage;
