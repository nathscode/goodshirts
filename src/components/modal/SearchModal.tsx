import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { Search } from "lucide-react";
import SearchSection from "../SearchSection";
interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
const SearchModal = ({ open, onOpenChange }: Props) => {
	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>
					<button className="transition ml-2">
						<Search className="size-5 text-gray-600" />
					</button>
				</DialogTrigger>
				<DialogContent>
					<SearchSection className="w-full mt-5" onOpenChange={onOpenChange} />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SearchModal;
