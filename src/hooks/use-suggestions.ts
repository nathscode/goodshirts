import axios from "axios";
import { useEffect, useState } from "react";
import { ProductWithCategory } from "../db/schema";

const useSuggestion = (searchTerm: string) => {
	const [suggestions, setSuggestions] = useState<ProductWithCategory[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!searchTerm) {
			setSuggestions([]);
			return;
		}

		// Debounce the API call
		const debounceTimeout = setTimeout(() => {
			setIsLoading(true);
			setError(null);

			axios
				.get(`/api/products/suggestions?q=${encodeURIComponent(searchTerm)}`)
				.then((response) => {
					setSuggestions(response.data);
				})
				.catch((err) => {
					console.error("Error fetching suggestions:", err);
					setError("Failed to fetch suggestions");
				})
				.finally(() => {
					setIsLoading(false);
				});
		}, 500); // 500ms debounce delay

		// Cleanup the timeout on searchTerm change
		return () => clearTimeout(debounceTimeout);
	}, [searchTerm]);

	return { suggestions, isLoading, error };
};

export default useSuggestion;
