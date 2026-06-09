@AGENTS.md

# Meridian — 项目指南

海外电商内容展示站。**Next.js 16 (App Router) + Cloudflare Workers (OpenNext) + next-intl + Content Collections**。分三期：① 公司/产品内容展示 + 跳转亚马逊等平台（已完成）② 在线询盘 ③ 自有支付。

完整实施方案见 `~/.claude/plans/cloudflare-distributed-rain.md`。

## 关键约定与踩坑（务必遵守）

1. **用 `src/middleware.ts`（edge），不要改成 `proxy.ts`**。Next 16 把 middleware 改名为 proxy 并强制 nodejs runtime，但 OpenNext 当前不支持 Node middleware（会报 "Node.js middleware is not currently supported"）。`next build` 的 "middleware deprecated" 警告是**预期的**，忽略它，直到 OpenNext 支持 proxy 再迁移。

2. **Content Collections** 用直接 zod schema（`schema: z.object({...})`，从 `zod` 导入），**不是**函数式 `(z) => ({...})`（0.15 已移除）。`defineConfig` 用 `content:` 而非 `collections:`。

3. **字体**：拉丁用 Geist + Plus Jakarta Sans（`next/font/google`）；CJK/阿语/泰语用系统字体栈（见 `globals.css` 的 `--font-sans`）。**禁用 Inter**（被 frontend-design 规则禁止）。

4. **i18n**：`localePrefix: 'as-needed'`（en 无前缀）。多语言文案在内容字段内嵌（`{ en, zh, ... }`，en 必填）。**缺译处理是核心**：产品的 `translatedLocales` 字段 + 详情页 `export const dynamicParams = false` + `generateStaticParams` 只生成 `[en, ...translatedLocales]`，未译语言返回 404，杜绝伪翻译页污染 SEO。hreflang（`alternatesFor`）与 sitemap 同步只列已译语言。

5. **图片** `images.unoptimized`（Workers 无 sharp）；大图后续走 Cloudflare Images。

6. **Cloudflare 绑定**（二期起）：`getCloudflareContext().env`（from `@opennextjs/cloudflare`）；SSG 路由用 `{ async: true }`。本地 `next dev` 经 `initOpenNextCloudflareForDev()` 即可访问绑定。

## 命令

- `npm run dev` — 本地开发（:3000）
- `npm run build` — Next 构建
- `npm run preview` — OpenNext + workerd 本地预览（最贴近线上）
- `npm run deploy` — 构建并部署到 Cloudflare
- `npm run cf-typegen` — 生成绑定类型（CloudflareEnv）

## 目录

- `content/` 内容（`products/*.json`、`pages/*.json`）
- `messages/<locale>.json` UI 文案
- `src/i18n/`（routing/request/navigation）、`src/middleware.ts`
- `src/app/[locale]/`（页面）、`src/app/{sitemap,robots}.ts`
- `src/components/`、`src/lib/`（products / seo / site / i18n-content）
- `content-collections.ts` / `open-next.config.ts` / `wrangler.jsonc`

## 内容维护

新增产品：在 `content/products/` 加一个 `.json`，按 schema 填字段。`translatedLocales` 列出已完成翻译的语言（仅这些语言会生成页面并进 hreflang/sitemap）。新增产品分类需同步 `content-collections.ts` 的 `category` enum。

## 分期 TODO（二、三期）

- **二期 询盘**：`app/api/inquiry/route.ts`（动态）→ Turnstile 校验 + 限流 → 幂等写 D1（`submission_id` 唯一）→ Resend 发信 → 303。wrangler 加 `DB` 绑定与 secrets。
- **三期 支付**：Stripe Checkout（服务端按 SKU 定价 + 幂等键）+ `app/api/stripe/webhook/route.ts`（`req.text()` 原始体验签 + `event.id` 去重 + async 事件）；订单真相在 D1，KV 不存金额。部署前 `wrangler deploy --dry-run` 查 Worker gzip 体积。

## 部署前

改 `src/lib/site.ts` 的 `url` 与 `src/app/[locale]/layout.tsx` 的 `metadataBase` 为正式域名（影响 canonical/hreflang/sitemap）。
