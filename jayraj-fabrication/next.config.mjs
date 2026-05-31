/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  experimental: {
    // Tree-shake large icon/component packages to avoid webpack chunk factory collisions
    optimizePackageImports: ["lucide-react", "@supabase/supabase-js", "@supabase/ssr"],
  },
};

export default nextConfig;
