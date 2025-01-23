import OrderDetailCard from "@/components/card/OrderDetailCard";
import BackButton from "@/components/common/BackButton";
import RatingForm from "@/components/form/RatingForm";

interface Props {
	params: {
		id: string;
	};
}

const ReviewDetailPage = async ({ params }: Props) => {
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
						<RatingForm />
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewDetailPage;
