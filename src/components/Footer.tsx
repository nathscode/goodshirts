import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Footer = () => {
	return (
		<MaxWidthWrapper>
			<div className="flex flex-col px-8 pt-20">
				<div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
					<div className="sm:col-span-2">
						<div className="mt-6 lg:max-w-sm">
							<h2 className="font-inter text-gray-800 text-lg sm:text-2xl">
								<Link
									href="mailto:support@africagoodshirts.com"
									aria-label="Our email"
									title="Our email"
									className="transition-colors hover:underline"
								>
									support@africagoodshirts.com
								</Link>
							</h2>
							<div className="flex items-center mt-2 space-x-3">
								<Link
									href="/"
									title="Follow us on instagram"
									className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-7 text-black"
									>
										<path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
										<circle cx="16.806" cy="7.207" r="1.078" />
										<path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
									</svg>
								</Link>
								<Link
									href="/"
									title="follow us on facebook"
									className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										className="size-7 text-black"
									>
										<path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
					<div className="space-y-2 text-sm">
						<h2 className="text-base font-bold tracking-wide text-gray-900 font-dela">
							Address
						</h2>
						<div className="flex">
							<p className="mr-1 text-gray-800">Phone: </p>
						</div>
						<div className="flex">
							<p className="mr-1 text-gray-800">Address:</p>
							<p>Lagos</p>
						</div>
					</div>
					<div>
						<span className="text-base font-dela font-bold tracking-wide text-gray-900">
							info
						</span>

						<ul className="flex flex-col mb-3 space-y-2">
							<li>
								<Link
									href="/faqs"
									className="text-sm text-gray-600 transition-colors duration-300 hover:underline"
								>
									F.A.Q
								</Link>
							</li>
							<li>
								<Link
									href="/policy"
									className="text-sm text-gray-600 transition-colors duration-300 hover:underline"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-sm text-gray-600 transition-colors duration-300 hover:underline"
								>
									Terms &amp; Conditions
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
					<p className="text-sm text-gray-600">
						&copy; Copyright {new Date().getFullYear()} Africagoodshirts.ng All
						rights reserved.
					</p>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};
export default Footer;
