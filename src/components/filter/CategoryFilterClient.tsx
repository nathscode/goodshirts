"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/src/components/ui/accordion";
import { CategoriesWithExtra } from "@/src/db/schema";
import { Search } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import CategoryFilterItem from "./CategoryFilterItem";

type Props = {
	categories: CategoriesWithExtra[];
};

const CategoryFilterClient = ({ categories }: Props) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	return (
		<Accordion type="single" collapsible={true}>
			<AccordionItem value="item-1">
				<AccordionTrigger className="">Category</AccordionTrigger>
				<AccordionContent>
					<div className="flex flex-col w-full">
						<div className="justify-start w-full">
							<div className="relative flex items-center w-full h-10 rounded-lg focus-within:border-gray-800 border bg-white overflow-hidden">
								<div className="grid place-items-center h-full w-12 text-gray-300">
									<Search className="size-4" />
								</div>
								<input
									className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
									type="text"
									id="search"
									placeholder="Search category.."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
						<ul className="flex flex-col w-full gap-y-2 my-4">
							<ScrollArea className="min-h-[150px] w-full">
								{filteredCategories && filteredCategories.length > 0 ? (
									filteredCategories.map((category) => (
										<CategoryFilterItem key={category.id} category={category} />
									))
								) : (
									<li>No categories yet</li>
								)}
							</ScrollArea>
						</ul>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

export default CategoryFilterClient;
