// useFetchStates.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export type StateType = {
	label: string;
	value: string;
};

const useFetchStates = () => {
	const [states, setStates] = useState<StateType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const getStatesFromApi = useCallback(async () => {
		setIsLoading(true);
		let response = await axios.get("https://nga-states-lga.onrender.com/fetch");
		let data = response.data;
		setStates(data.map((state: StateType) => ({ label: state, value: state })));
		setIsLoading(false);
	}, []);

	useEffect(() => {
		getStatesFromApi();
	}, [getStatesFromApi]);

	return { states, isLoading };
};

export default useFetchStates;
