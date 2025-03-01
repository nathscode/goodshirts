import { useState, useEffect } from "react";
import statesData from "../data/states.json";
import { StateData } from "../types";

export const useStates = () => {
	const [states, setStates] = useState<StateData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			if (statesData.states && Array.isArray(statesData.states)) {
				setStates(statesData.states);
				setLoading(false);
			} else {
				throw new Error("Data is not in the expected format");
			}
		} catch (err) {
			setError("Failed to load states data");
			setLoading(false);
			console.error("Error loading states:", err);
		}
	}, []);

	return { states, loading, error };
};
