import { getAllCollectionProducts } from "@/src/actions/collection.action";
import CollectionForm from "@/src/components/form/CollectionForm";

const CreateCollection = async () => {
	const products = await getAllCollectionProducts();
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-xl">
				<div className="container">
					<CollectionForm products={products} />
				</div>
			</div>
		</div>
	);
};

export default CreateCollection;
