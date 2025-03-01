import * as React from "react";
import SidebarItem from "./sidebarItem";

export function SecondarySidebarItem({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: React.JSX.Element;
		isActive: boolean;
	}[];
} & React.ComponentPropsWithoutRef<any>) {
	return (
		<div
			className="relative flex w-full min-w-0 flex-col p-2 justify-end items-end"
			{...props}
		>
			<div className="w-full text-sm">
				<div role="menu" className="flex w-full min-w-0 flex-col gap-1">
					{items.map((item) => (
						<div key={item.title} className="flex flex-col">
							<SidebarItem
								icon={item.icon}
								label={item.title}
								active={item.isActive!}
								href={item.url}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
