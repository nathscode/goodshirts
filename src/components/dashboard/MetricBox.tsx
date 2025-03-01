import { formatCurrency, formatNumberWithCommas } from "@/src/lib/utils";
import React from "react";

type Props = {
	title: string;
	icon: React.JSX.Element;
	metric: number;
	isMoney?: boolean;
};

const MetricBox = ({ title, icon, metric, isMoney }: Props) => {
	return (
		<div className="flex flex-col justify-start">
			<div className="bg-slate-50 p-6 rounded-lg">
				<div className="flex flex-row space-x-4 items-start">
					<div id="stats-1">{icon}</div>
					<div className="justify-start">
						<p className="text-black text-sm font-semibold uppercase leading-4">
							{title}
						</p>
						<p className="text-black font-bold text-xl inline-flex items-center space-x-2 mt-1">
							<span>
								{isMoney
									? formatCurrency(metric)
									: formatNumberWithCommas(metric)}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MetricBox;
