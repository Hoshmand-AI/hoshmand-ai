/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // MindCue AI is off the site for now; its page sends visitors to the product lineup.
    // Temporary (307) so it can come back. /privacy and /terms stay live for the App Store listing.
    return [{ source: "/mindcue", destination: "/products", permanent: false }];
  },
};

export default nextConfig;
