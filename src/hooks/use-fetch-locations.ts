// types.ts
interface LocationData {
	code: string;
	name: string;
	lgas: string[];
	cities: string[];
}

interface LocationState<T> {
	state: "idle" | "loading" | "success" | "error";
	data?: T;
	error?: string;
}

// useLocations.ts
import { useState, useEffect } from "react";

export const useLocations = (): LocationState<LocationData> => {
	const [state, setState] = useState<LocationState<LocationData>>({
		state: "idle",
		data: undefined,
		error: undefined,
	});

	useEffect(() => {
		const fetchLocations = async () => {
			setState({ ...state, state: "loading" });

			try {
				const response = await fetch(
					"https://gist.githubusercontent.com/nathscode/63971d9261caf4b4204a106c6e6f2acb/raw"
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: LocationData = await response.json();
				setState({
					state: "success",
					data,
					error: undefined,
				});
			} catch (error) {
				setState({
					state: "error",
					data: undefined,
					error:
						error instanceof Error
							? error.message
							: "An unknown error occurred",
				});
			}
		};

		fetchLocations();
	}, []);

	return state;
};
