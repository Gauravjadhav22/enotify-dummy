/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard/quotes/overview",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
