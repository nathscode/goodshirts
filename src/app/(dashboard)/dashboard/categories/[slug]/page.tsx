import getCategoryBySlug from "@/src/actions/getCategoryBySlug";
import NotFound from "@/src/app/not-found";
import SubCategoryItem from "@/src/components/SubCategoryItem";
import BackButton from "@/src/components/common/BackButton";
import CategoryForm from "@/src/components/form/CategoryForm";
import SubCategoryModal from "@/src/components/modal/SubCategoryModal";
import { redirect } from "next/navigation";

interface IParams {
	slug?: string;
}

const CategoryDetails = async ({ params }: { params: IParams }) => {
	const { slug } = await params;
	if (!slug) return redirect("/dashboard/categories");
	const category = await getCategoryBySlug(slug);

	if (!category) return <NotFound />;

	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col justify-start w-full px-5 ">
				<div className="flex flex-col justify-start w-fit">
					<BackButton />
				</div>
				<div className="flex flex-wrap justify-between w-full mt-4">
					<div className="w-full md:w-3/5  px-4">
						<div className="flex flex-col w-fit mb-4">
							<SubCategoryModal categorySlug={category.slug} />
						</div>
						<div className="flex flex-col w-full">
							{category && category.subCategories?.length > 0 ? (
								category.subCategories.map((sub) => (
									<SubCategoryItem key={sub.id} subCategory={sub} />
								))
							) : (
								<div className="font-semibold">No Sub categories Yet</div>
							)}
						</div>
					</div>
					<div className="w-full md:w-2/5  px-4">
						<CategoryForm initialData={category} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CategoryDetails;
