import { baseURL } from "@/src/lib/constants";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CategoryType } from "../db/schema";

const useFetchCategories = () => {
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null); // Error state

	const getCategoriesFromApi = useCallback(async () => {
		setIsLoading(true);
		setError(null); // Reset error state before fetching

		try {
			const response = await axios.get(`${baseURL}/categories/`);
			const data = response.data;
			setCategories(
				data.map((category: CategoryType) => ({
					id: category.id,
					name: category.name,
				}))
			);
		} catch (err) {
			console.error("Error fetching categories:", err);
			setError("Failed to fetch categories. Please try again."); // Set error message
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		getCategoriesFromApi();
	}, [getCategoriesFromApi]);

	return { categories, isLoading, error }; // Return error state
};

export default useFetchCategories;
