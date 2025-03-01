import getAllCategories from "@/src/actions/getAllCategories";
import CategoryFilterClient from "./CategoryFilterClient";

type Props = {};

const CategoryFilter = async (props: Props) => {
	const categories = await getAllCategories();

	return (
		<div className="flex flex-col w-full border rounded-md px-4">
			<CategoryFilterClient categories={categories} />
		</div>
	);
};

export default CategoryFilter;
