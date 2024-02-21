/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/concept/list",
        permanent: false,
      },
      {
        source: "/concept/search",
        destination: "/concept/list",
        permanent: false,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
