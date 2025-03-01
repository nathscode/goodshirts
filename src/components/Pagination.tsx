import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
	currentPage: number;
	totalItems: number;
	itemPerPage: number;
	onPageChange: (currentPage: number) => void;
	isPreviousData: any;
};

const Pagination = ({
	currentPage,
	totalItems,
	onPageChange,
	isPreviousData,
	itemPerPage,
}: Props) => {
	const handlePrevClick = () => onPageChange(currentPage - 1);
	const handleNextClick = () => onPageChange(currentPage + 1);
	const handlePageClick = (page: number) => onPageChange(page);

	return (
		<div className="flex justify-start items-center space-x-2">
			<Button
				disabled={currentPage === 1 || isPreviousData}
				onClick={handlePrevClick}
				size="icon"
				variant="ghost"
			>
				<ArrowLeft className="h-5 w-5" />
			</Button>
			{Array.from({ length: totalItems }, (_, index) => index + 1).map(
				(page) => (
					<Button
						key={page}
						size="icon"
						variant={`${currentPage === page ? "default" : "ghost"}`}
						onClick={() => handlePageClick(page)}
					>
						{page}
					</Button>
				)
			)}
			<Button
				disabled={currentPage === totalItems || isPreviousData}
				onClick={handleNextClick}
				size="icon"
				variant="ghost"
			>
				<ArrowRight className="h-5 w-5" />
			</Button>
		</div>
	);
};

export default Pagination;
