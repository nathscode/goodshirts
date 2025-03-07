import { useCallback, useEffect, useState } from "react";
import getSubCategoryById from "../actions/getSubCategoryById";
import { SubCategoryType } from "../db/schema";

const useFetchSubCategories = (categoryId?: string) => {
	const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
	const [isSubCategoryLoading, setIsSubCategoryLoading] =
		useState<boolean>(false);
	const [error, setError] = useState<string | null>(null); // Error state

	const getSubCategoriesFromApi = useCallback(async () => {
		if (!categoryId) return;

		setIsSubCategoryLoading(true);
		setError(null); // Reset error state before fetching

		try {
			const data = await getSubCategoryById(categoryId);
			setSubCategories(data);
		} catch (err) {
			console.error("Error fetching subcategories:", err);
			setError("Failed to fetch subcategories. Please try again."); // Set error message
		} finally {
			setIsSubCategoryLoading(false);
		}
	}, [categoryId]);

	useEffect(() => {
		getSubCategoriesFromApi();
	}, [getSubCategoriesFromApi]);

	return { subCategories, isSubCategoryLoading, error }; // Return error state
};

export default useFetchSubCategories;
