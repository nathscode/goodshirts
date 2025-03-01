"use client";
import { Heading } from "../Heading";
import CategoryList from "./CategoryList";
import HomeProduct from "./HomeProduct";

type Props = {};
const HomeCollection = (props: Props) => {
	return (
		<section className="flex flex-col w-full py-20">
			<Heading
				title="MEN COLLECTION"
				subtitle="Find anything you need and feel your best, shop the men' latest fashion and lifestyle products."
			/>
			<CategoryList />
			<div className="flex flex-col pt-5 w-full">
				<HomeProduct />
			</div>
		</section>
	);
};

export default HomeCollection;
