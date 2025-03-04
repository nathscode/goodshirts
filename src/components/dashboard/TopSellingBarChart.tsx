"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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
	ChartTooltip,
	ChartTooltipContent,
} from "@/src/components/ui/chart";

// Define the chart configuration
const chartConfig: ChartConfig = {
	sales: {
		label: "Sales",
		color: "hsl(var(--chart-1))",
	},
};

// Define the type for sales data
type TopSellingBarChartProps = {
	salesData: {
		month: string; // Changed from "monthly" to "month"
		totalSales: number;
	}[];
};

export function TopSellingBarChart({ salesData }: TopSellingBarChartProps) {
	// Handle case when there's no data
	if (!salesData || salesData.length === 0) {
		return (
			<Card className="flex flex-col items-center justify-center p-6">
				<CardHeader>
					<CardTitle>Sales of the Month</CardTitle>
					<CardDescription>No data available</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sales of the Month</CardTitle>
				<CardDescription>January - December</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={salesData} margin={{ top: 20 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month" // Ensure consistency with salesData structure
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)} // Show first 3 letters of the month
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey="totalSales" fill="hsl(var(--chart-1))" radius={8}>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
