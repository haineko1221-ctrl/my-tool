import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // スマホなど同じネットワーク内のデバイスからのアクセスを許可
  allowedDevOrigins: ['192.168.0.6'],
};

export default nextConfig;
