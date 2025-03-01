import React from "react";
import { SubCategoryType } from "../db/schema";
import DeleteItem from "./common/DeleteItem";

type Props = {
	subCategory: SubCategoryType;
};

const SubCategoryItem = ({ subCategory }: Props) => {
	return (
		<div className="flex justify-between items-center space-y-5">
			<div className="justify-start">
				<h2 className="font-bold text-base capitalize">{subCategory.name}</h2>
			</div>
			<div className="justify-end">
				<DeleteItem slug={subCategory.slug} item="sub-categories" />
			</div>
		</div>
	);
};

export default SubCategoryItem;
