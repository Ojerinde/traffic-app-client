/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/my_courses",
        permanent: true,
      },
      {
        source: "/level_adviser",
        destination: "/level_adviser/login",
        permanent: true,
      },
      {
        source: "/level_adviser/dashboard",
        destination: "/level_adviser/dashboard/profile",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};
export default nextConfig;
/** @type {import('next').NextConfig} */
