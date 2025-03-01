import { useCallback, useEffect, useState } from "react";
import getSubCategoryById from "../actions/getSubCategoryById";
import { SubCategoryType } from "../db/schema";

const useFetchSubCategories = (categoryId?: string) => {
	const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
	const [isSubCategoryLoading, setIsSubCategoryLoading] =
		useState<boolean>(false);

	const getSubCategoriesFromApi = useCallback(async () => {
		if (!categoryId) return;

		setIsSubCategoryLoading(true);
		try {
			const data = await getSubCategoryById(categoryId);
			setSubCategories(data);
		} catch (error) {
			console.error("Error fetching subcategories:", error);
		}
		setIsSubCategoryLoading(false);
	}, [categoryId]);

	useEffect(() => {
		getSubCategoriesFromApi();
	}, [getSubCategoriesFromApi]);

	return { subCategories, isSubCategoryLoading };
};

export default useFetchSubCategories;
