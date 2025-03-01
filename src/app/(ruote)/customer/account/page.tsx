import { auth } from "@/auth";
import getCurrentUser from "@/src/actions/getCurrentUser";
import AddressBox from "@/src/components/AddressBox";
import BackButton from "@/src/components/common/BackButton";

type Props = {};

const CustomerAccountPage = async (props: Props) => {
	const session = await getCurrentUser();
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Account Overview</h1>
				</div>
				<div className="flex flex-wrap justify-between w-full mt-4">
					<div className="w-full md:w-1/2  md:pr-5 mb-5 md:mb-0">
						<div className="flex flex-col w-full border rounded-sm">
							<div className="flex flex-col border-b px-4 py-2">
								<h1 className="text-sm font-medium uppercase">
									Account details
								</h1>
							</div>
							<div className="flex flex-col p-4">
								<p className="text-sm capitalize">{`${session?.firstName} ${session?.lastName}`}</p>
								<p className="text-sm capitalize text-gray-500 mt-1">
									{`${session?.email}`}
								</p>
							</div>
						</div>
					</div>
					<div className="w-full md:w-1/2  md:pr-5 mb-5 md:mb-0">
						<AddressBox id={session?.id!} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerAccountPage;
