import React from "react";
import CartCard from "./card/CartCard";

type Props = {};

const CartSection = (props: Props) => {
	return (
		<div className="flex flex-col flex-1 w-full">
			<CartCard />
		</div>
	);
};

export default CartSection;
