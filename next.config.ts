/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// @ts-ignore
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false;
			config.resolve.fallback.dns = false;
			config.resolve.fallback.net = false;
			config.resolve.fallback.tls = false;
		}
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.tebi.io",
			},
			{
				protocol: "https",
				hostname: "i.ibb.co",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
