import BackButton from "@/src/components/common/BackButton";
import VariantForm from "@/src/components/form/VariantForm";
import { redirect } from "next/navigation";
import React from "react";

interface IParams {
	slug?: string;
}
const AddVariants = async ({ params }: { params: IParams }) => {
	const { slug } = await params;
	if (!slug) return redirect("/dashboard/products");
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex justify-center items-center flex-col w-full">
				<div className="flex flex-col items-center justify-center w-full max-w-lg">
					<div className="flex flex-col justify-start w-fit">
						<BackButton />
					</div>
					<div className="flex justify-end w-full">
						<VariantForm slug={slug} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddVariants;
