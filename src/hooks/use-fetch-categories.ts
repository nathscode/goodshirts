// useFetchStates.js
import { baseURL } from "@/src/lib/constants";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CategoryType } from "../db/schema";

const useFetchCategories = () => {
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const getCategoriesFromApi = useCallback(async () => {
		setIsLoading(true);
		let response = await axios.get(`${baseURL}/categories/`);
		let data = response.data;
		setCategories(
			data.map((category: CategoryType) => ({
				id: category.id,
				name: category.name,
			}))
		);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		getCategoriesFromApi();
	}, [getCategoriesFromApi]);

	return { categories, isLoading };
};

export default useFetchCategories;
