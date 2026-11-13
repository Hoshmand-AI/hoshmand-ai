/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // MindCue AI is off the site for now; its page sends visitors to the product lineup.
    // Temporary (307) so it can come back. /privacy and /terms stay live for the App Store listing.
    return [
      { source: "/mindcue", destination: "/products", permanent: false },
      // Planora is now RunF9. Old links (and the Planora app's own footer) land on the new page.
      { source: "/products/planora", destination: "/products/runf9", permanent: false },
    ];
  },
};

export default nextConfig;
