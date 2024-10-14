/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**"
      }
    ]
  },
  async headers() {
    return [
      {
        // matching business-hours API route for any bot id
        source: "/api/bot/:anyid/business-hours",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://support.amboss.com"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET"
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
