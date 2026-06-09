import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withContentCollections } from "@content-collections/next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// 让本地 `next dev` 也能访问 Cloudflare 绑定（D1/KV/R2/env）。
initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // 第一期不经图片优化后端（Workers 无 sharp），直接服务；
  // 图片可在上传/构建前预优化，后续需要按需变换时再切 Cloudflare Images。
  images: { unoptimized: true },
};

export default withContentCollections(withNextIntl(nextConfig));
