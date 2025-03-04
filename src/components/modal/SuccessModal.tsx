"use client";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Button } from "../ui/button";
function SuccessModal({ onClose }: { onClose: () => void }) {
	const { width, height } = useWindowSize();
	const [run, setRun] = useState(false);

	useEffect(() => {
		setRun(true);
		setTimeout(() => {
			setRun(false);
			onClose();
		}, 6000);
	}, []);

	return (
		<Dialog open={run}>
			<DialogContent className="max-w-screen-md p-5">
				<div className="flex flex-col justify-center items-center size-full">
					<CheckCircle2 className="w-20 h-20 fill-green-500 text-white mx-auto" />
					<h3 className="font-bold text-lg mt-2">Congratulations!</h3>
					<p className="my-2">Your Order has been placed.</p>
					<Button
						asChild
						className="uppercase inline-flex text-center items-center justify-center text-sm rounded-none font-semibold py-2 px-8 mt-4"
					>
						<Link href="/customer/orders">View your Order</Link>
					</Button>
				</div>
				<Confetti width={width} height={height} recycle={run} />
			</DialogContent>
		</Dialog>
	);
}
export default SuccessModal;
