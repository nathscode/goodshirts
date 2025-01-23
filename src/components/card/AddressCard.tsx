import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

type Props = {};

const AddressCard = (props: Props) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full border rounded-sm">
				<div className="flex flex-col border-b px-4 py-2">
					<h1 className="text-sm font-medium uppercase">Address</h1>
				</div>
				<div className="flex flex-col p-4">
					<p className="text-sm capitalize font-semibold">
						Default Shipping Address
					</p>
					<p className="text-sm capitalize text-gray-500 mt-1">
						Michael Nathan <br />
						Ikeja, <br />
						Lagos State.
						<br />
						090123456789
					</p>
				</div>
				<div className="flex flex-col border-t p-2">
					<div className="flex justify-between items-center w-full">
						<div className="justify-start">
							<Button variant={"ghost"} className="font-semibold">
								Set as default
							</Button>
						</div>
						<div className="justify-end">
							<div className="flex justify-start space-x-1">
								<Button variant={"ghost"}>
									<Edit2 className="size-4" />
								</Button>
								<Button variant={"ghost"}>
									<Trash2 className="size-4 text-red-500" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressCard;
