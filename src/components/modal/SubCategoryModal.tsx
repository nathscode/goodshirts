import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { Plus } from "lucide-react";
import SubCategoryForm from "../form/SubCategoryForm";
type Props = {
	categorySlug: string;
};

const SubCategoryModal = ({ categorySlug }: Props) => {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="uppercase inline-flex rounded-none font-semibold px-5">
						<Plus className="size-7" />
						Add
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Sub Categories</DialogTitle>
					</DialogHeader>
					<div className="flex items-start flex-col w-full justify-start">
						<SubCategoryForm categorySlug={categorySlug} />
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SubCategoryModal;
