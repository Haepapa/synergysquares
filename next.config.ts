import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment for Docker/self-hosted deployments:
  // output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent the page from being embedded in an iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer information sent with requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features not needed by the app
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
