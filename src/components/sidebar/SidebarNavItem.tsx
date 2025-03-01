"use client";
import { Collapsible } from "@/src/components/ui/collapsible";
import SidebarItem from "./sidebarItem";

export function SidebarNavItem({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: React.JSX.Element;
		active?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<div className="relative flex w-full min-w-0 flex-col p-2">
			<div role="menu" className="flex w-full min-w-0 flex-col">
				{items.map((item) => (
					<Collapsible key={item.title} asChild defaultOpen={item.active}>
						<div className="w-full flex flex-col">
							<SidebarItem
								icon={item.icon}
								label={item.title}
								active={item.active!}
								href={item.url}
							/>
						</div>
					</Collapsible>
				))}
			</div>
		</div>
	);
}
