/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wqoerpthqyjhpdccewhz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/photo/**",
      },
    ],
  },
};

module.exports = nextConfig;
