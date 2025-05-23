import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import BackButton from "@/src/components/common/BackButton";
import CheckoutClient from "./CheckoutClient";
import getCurrentUser from "@/src/actions/getCurrentUser";

type Props = {};

const CheckoutPage = async (props: Props) => {
	const session = await getCurrentUser();
	return (
		<MaxWidthWrapper>
			<div className="relative px-2 md:px-10 py-5">
				<div className="flex flex-col items-start justify-start my-4">
					<div className="flex justify-start items-center">
						<BackButton href="/products" />
						<h1 className="text-xl font-bold">Checkout</h1>
					</div>
					<CheckoutClient session={session ?? null} />
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default CheckoutPage;
