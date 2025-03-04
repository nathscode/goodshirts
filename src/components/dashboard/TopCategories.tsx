"use client";

import { useEffect, useState } from "react";
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

const chartColors = ["#8338ec", "#ffbe0b", "#fb5607", "#ff006e", "#3a86ff"];

export function TopCategories({ categories }: TopCategoriesProps) {
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

	// Generate chart configuration
	const chartConfig: ChartConfig = categories.reduce(
		(config, category, index) => {
			const color = chartColors[index % chartColors.length]; // Assign color cyclically
			config[category.name.toLowerCase()] = {
				label: category.name,
				color,
			};
			return config;
		},
		{} as ChartConfig
	);

	// Format data for PieChart
	const chartData = categories.map((category) => ({
		name: category.name,
		orders: Number(category.totalOrders),
		fill: chartConfig[category.name.toLowerCase()].color, // Ensure consistency
	}));

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
