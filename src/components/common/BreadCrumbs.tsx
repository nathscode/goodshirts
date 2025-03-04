import { BreadcrumbTypes } from "@/src/types";
import Link from "next/link";
import React from "react";

type Props = {
	lists: BreadcrumbTypes[];
};

const BreadCrumbs = ({ lists }: Props) => {
	return (
		<nav className="flex p-2 " aria-label="Breadcrumb">
			<div className="container">
				<ol className="inline-flex flex-wrap items-center w-full gap-y-2 md:gap-y-0 md:justify-end uppercase  space-x-1 md:space-x-2">
					<li className="inline-flex items-center">
						<Link
							href="/"
							className="inline-flex items-center text-[12px] font-medium text-gray-500 hover:text-brand"
						>
							<svg
								className="w-3 h-3 me-2.5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
							</svg>
							Home
						</Link>
					</li>
					{lists &&
						lists.map((list, index) => (
							<li key={index}>
								<div className="flex items-center">
									<svg
										className="rtl:rotate-180 w-2.5 h-2.5 text-brand mx-0.5"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 6 10"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="m1 9 4-4-4-4"
										/>
									</svg>
									{list.hasLink ? (
										<Link
											href={list.href ?? "#"}
											className="ms-1 text-[12px] font-medium text-gray-500 hover:underline md:ms-2 "
										>
											{list.name}
										</Link>
									) : (
										<span className="ms-1 text-[12px] font-medium text-gray-500  md:ms-2 ">
											{list.name}
										</span>
									)}
								</div>
							</li>
						))}
				</ol>
			</div>
		</nav>
	);
};

export default BreadCrumbs;
