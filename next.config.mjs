/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
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
        hostname: "down-id.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "down-bs-id.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.tokopedia.net",
      },
    ],
  },
};

export default nextConfig;
