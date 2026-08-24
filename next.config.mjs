/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cf.shopee.co.id",
      },
      {
        protocol: "https",
        hostname: "images.tokopedia.net",
      },
    ],
  },
};

export default nextConfig;
