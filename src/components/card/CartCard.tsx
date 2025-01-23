import { Heart, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

const CartCard = (props: Props) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row mb-2 min-h-[100px] p-2 rounded-lg">
				<div className="relative shrink-0 w-[70px] sm:w-[100px] h-[100px] overflow-hidden bg-slate-300 rounded-md">
					<Image
						className="object-cover w-full h-full rounded-md"
						src={"/images/placeholder-image.png"}
						alt={"food"}
						fill
					/>
				</div>
				<div className="flex flex-col ml-5 w-full">
					<div className="flex justify-between w-full">
						<div className="justify-start">
							<h4 className="text-sm font-bold">SweetShirt</h4>
						</div>
						<div className="justify-end">
							<h4 className="font-bold">25000 </h4>
						</div>
					</div>
					<div className="flex flex-col space-y-1 text-gray-500">
						<span>
							Qty: <small className="uppercase">1</small>
						</span>
						<span>
							Size: <small className="uppercase">xl</small>
						</span>
						<span>
							Color: <small className="uppercase">Purple</small>
						</span>
					</div>
					<div className="flex justify-between w-full mt-4">
						<div className="flex space-x-4 justify-start">
							<button className="flex flex-col items-center justify-center h-8 w-8 bg-slate-100 rounded-full hover:cursor-pointer hover:text-red-800">
								<Trash className="h-4 w-4" />
							</button>
							<button className="flex flex-col items-center justify-center h-8 w-8 bg-slate-100 rounded-full hover:cursor-pointer hover:text-red-400">
								<Heart className="h-4 w-4" />
							</button>
						</div>
						<div className="justify-end">
							<form className="max-w-xs mx-auto">
								<div className="relative flex items-center max-w-[8rem]">
									<button
										type="button"
										data-input-counter-decrement="quantity-input"
										className="bg-gray-100  hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100  focus:ring-2 focus:outline-none"
									>
										<Minus className="h-4 w-4" />
									</button>
									<input
										type="text"
										className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 "
										placeholder="1"
										value={1}
									/>
									<button
										type="button"
										data-input-counter-increment="quantity-input"
										className="bg-gray-100  hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100  focus:ring-2 focus:outline-none"
									>
										<Plus className="h-4 w-4" />
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartCard;
