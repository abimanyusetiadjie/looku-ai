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
        hostname: "assets.myntassets.com",
      },
      {
        protocol: "http",
        hostname: "assets.myntassets.com",
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
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "*.pinimg.com",
      },
    ],
  },
};

export default nextConfig;
