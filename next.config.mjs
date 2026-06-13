/** @type {import('next').NextConfig} */
// Static export for GitHub Pages (served from https://rudra496.github.io/loveyoumom/)
const nextConfig = {
  output: "export",
  basePath: "/loveyoumom",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
