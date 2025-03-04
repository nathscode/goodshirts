"use client";

import { Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "@/src/components/ui/chart";

// Define the props type
type TopCategoriesProps = {
	categories: {
		id: number;
		name: string;
		totalOrders: number;
	}[];
};

// Define a set of colors for the chart
const chartColors = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
];

export function TopCategoriesFake({ categories }: TopCategoriesProps) {
	// If no data, show a message
	if (!categories || categories.length === 0) {
		return (
			<Card className="flex flex-col items-center justify-center p-6">
				<CardHeader>
					<CardTitle>Top Categories</CardTitle>
					<CardDescription>No data available</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	// Format data for PieChart
	const chartData = [
		{ name: "shirts", orders: 1, fill: "#ff006e" },
		{ name: "shoes", orders: 1, fill: "#8338ec" },
	];
	console.log({ chartData });

	const chartConfig = {
		shirts: {
			label: "shirts",
			color: "#ff006e",
		},
		shoes: {
			label: "Shoes",
			color: "#8338ec",
		},
	} satisfies ChartConfig;

	console.log(chartConfig);

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Top Categories</CardTitle>
				<CardDescription>Based on Delivered Orders</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[300px]"
				>
					<PieChart>
						<Pie data={chartData} dataKey="orders" />
						<ChartLegend
							content={<ChartLegendContent nameKey="name" />}
							className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
