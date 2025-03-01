import { useEffect, useState } from "react";
import statesData from "../data/states.json";
import { StateData } from "../types";

export const useCities = (stateName: string) => {
	const [cities, setCities] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			if (!stateName) {
				setCities([]);
				setLoading(false);
				return;
			}

			const stateData = statesData.states.find(
				(state: StateData) => state.name === stateName
			);

			setCities(stateData?.cities || []);
			setLoading(false);
		} catch (err) {
			setError("Failed to load cities data");
			setLoading(false);
			console.error("Error loading cities:", err);
		}
	}, [stateName]);

	return { cities, loading, error };
};
