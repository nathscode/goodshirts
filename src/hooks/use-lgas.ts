import { useEffect, useState } from "react";
import statesData from "../data/states.json";
import { StateData } from "../types";

export const useLgas = (stateName: string) => {
	const [lgas, setLgas] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			if (!stateName) {
				setLgas([]);
				setLoading(false);
				return;
			}

			const stateData = statesData.states.find(
				(state: StateData) => state.name === stateName
			);

			setLgas(stateData?.lgas || []);
			setLoading(false);
		} catch (err) {
			setError("Failed to load cities data");
			setLoading(false);
			console.error("Error loading cities:", err);
		}
	}, [stateName]);

	return { lgas: lgas, loading, error };
};
