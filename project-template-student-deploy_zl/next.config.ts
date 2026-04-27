import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 生产构建使用 Webpack，turbopack 仅用于开发模式 (next dev --turbo)
  // 移除非标准配置项以确保 Vercel 构建正常
};

export default nextConfig;
