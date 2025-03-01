import ProductForm from "@/src/components/form/ProductForm";

const CreateProduct = () => {
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-xl">
				<div className="container">
					<ProductForm />
				</div>
			</div>
		</div>
	);
};

export default CreateProduct;
