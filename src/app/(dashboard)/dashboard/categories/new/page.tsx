import CategoryForm from "@/src/components/form/CategoryForm";

const CreateCategory = () => {
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-xl">
				<div className="container">
					<CategoryForm />
				</div>
			</div>
		</div>
	);
};

export default CreateCategory;
