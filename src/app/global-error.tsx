"use client"; // Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	console.error(error);

	return (
		<html>
			<body>
				<div className="flex flex-col items-center justify-center min-h-screen px-5 py-2">
					<div className="text-center">
						<h1 className="text-6xl font-semibold text-red-500">
							Something went
						</h1>
						<p className="mt-2 mb-4 text-gray-600">
							If it happens again, contact support
						</p>
						<button className="button" onClick={() => reset()}>
							Try again
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
