import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.spoonacular.com", "res.cloudinary.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/users/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
