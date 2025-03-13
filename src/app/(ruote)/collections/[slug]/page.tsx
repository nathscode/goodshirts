import fetchCollectionBySlug from "@/src/actions/collection.action";
import getCurrentUser from "@/src/actions/getCurrentUser";
import NotFound from "@/src/app/not-found";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import ProductCard from "@/src/components/card/ProductCard";
import { formatDateTime, getExpirationStatus } from "@/src/lib/utils";
import { redirect } from "next/navigation";

type Props = {};

const CollectionDetailPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	if (!slug) return redirect("/");
	const collection = await fetchCollectionBySlug(slug);
	if (!collection) return <NotFound />;
	const session = await getCurrentUser();

	return (
		<MaxWidthWrapper>
			<div className="flex flex-col w-full py-20">
				<div className="flex flex-col items-center justify-center w-full mb-10">
					<h1 className="text-2xl font-bold uppercase tracking-tight text-gray-900 sm:text-4 font-dela flex">
						{collection.name}
					</h1>
					<div className="flex justify-center text-center items-center gap-4 w-full mt-2">
						<div className="justify-start">
							<strong>
								{formatDateTime(collection.startDate!.toString())}
							</strong>
						</div>
						-
						<div className="justify-start">
							<strong>{formatDateTime(collection.endDate!.toString())}</strong>
							<span className="ml-2 text-red-500">
								{getExpirationStatus(collection.endDate!)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap justify-center md:justify-start w-full gap-5 ">
					{collection.collectionProducts.map((item) => (
						<ProductCard
							key={item.product.id}
							product={item.product}
							userId={session?.id!}
						/>
					))}
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default CollectionDetailPage;
