import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 第一期为纯静态（SSG），无需增量缓存。
// 启用 ISR 时改为：
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
// 并在 wrangler.jsonc 增加 NEXT_INC_CACHE_R2_BUCKET 的 R2 绑定。

export default defineCloudflareConfig({});
