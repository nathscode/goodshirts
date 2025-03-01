import getCurrentUser from "@/src/actions/getCurrentUser";
import { getUserOrderItemById } from "@/src/actions/getUserItemOrder";
import BackButton from "@/src/components/common/BackButton";
import RatingForm from "@/src/components/form/RatingForm";

interface Props {
	params: {
		id: string;
	};
}

const ReviewDetailPage = async ({ params }: Props) => {
	const { id } = await params;
	const order = await getUserOrderItemById(id);
	const user = await getCurrentUser();
	if (!user) {
		return { redirect: { destination: "/login", permanent: false } };
	}
	let lastName = user?.lastName;
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start">
						<BackButton />
					</div>
					<h1 className="text-xl font-medium">Rate and Review</h1>
				</div>
				<div className="flex flex-col justify-start w-full mt-4">
					<div className="flex flex-col w-full mt-4">
						<RatingForm
							productId={order?.product.id!}
							image={order?.product.medias[0].url!}
							name={order?.product.name!}
							lastName={lastName!}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewDetailPage;
