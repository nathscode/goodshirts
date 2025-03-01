import { Filter } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import SizeFilter from "./SizeFilter";
import ClearFilters from "./ClearFilters";

const FilterSection = () => {
	return (
		<div className="flex flex-col flex-1 w-full">
			<div className="flex justify-between items-center w-full px-5 py-2 bg-slate-100">
				<h4 className="text-base font-semibold">Filter</h4>
				<div className="justify-end">
					<Filter className="size-5" />
				</div>
			</div>
			{/* category section */}
			<div className="flex flex-col w-full">
				<CategoryFilter />
				<SizeFilter />
				<PriceFilter />
			</div>
			<ClearFilters />
		</div>
	);
};

export default FilterSection;
