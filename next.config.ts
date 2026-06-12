import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "https://translangbackend.onrender.com";

const nextConfig: NextConfig = {
  experimental: {
    // Allow up to 120 s for proxied API calls — covers Render.com cold-start
    // (free-tier services sleep after inactivity and can take 30-60 s to wake)
    proxyTimeout: 120_000,
  },
  async headers() {
    return [
      {
        // Cross-Origin Isolation headers — required for SharedArrayBuffer used
        // by onnxruntime-web threaded WASM (Silero VAD Web Worker).
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy",  value: "credentialless" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
