"use client";
import getAllCollection from "@/src/actions/getAllCollections";
import { useQuery } from "@tanstack/react-query";
import CollectionBanner from "../CollectionBanner";
import BannerSkeleton from "../skeleton/BannerSkeleton";

type Props = {};

const CollectionList = (props: Props) => {
	const getCollection = async () => {
		const response = await getAllCollection();
		return response;
	};

	const { isPending, error, data } = useQuery({
		queryKey: ["homeCollection"],
		queryFn: () => getCollection(),
	});

	const collection = data;

	if (isPending) {
		return (
			<div className="flex flex-col sm:flex-row justify-start max-w-full gap-4 my-5">
				<BannerSkeleton />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				Error retrieving recent collection
			</div>
		);
	}

	if (!collection || collection.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				No Active collection found
			</div>
		);
	}

	return (
		<div>
			{collection.map((item) => (
				<CollectionBanner key={item.id} collection={item} />
			))}
		</div>
	);
};

export default CollectionList;
