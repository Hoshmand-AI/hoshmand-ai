/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Saraf lives under /saraf; send the root there.
      { source: "/", destination: "/saraf", permanent: false },
    ];
  },
};

export default nextConfig;
