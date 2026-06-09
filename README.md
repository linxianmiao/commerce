# Meridian — 海外电商内容展示站

多语言（7 种语言，含阿拉伯语 RTL）的消费电子品牌官网，部署于 Cloudflare Workers。第一期为公司/产品内容展示 + 跳转亚马逊/Shopee 等平台下单。

## 技术栈

- **Next.js 16**（App Router，Server Components 优先）
- **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)（OpenNext）
- **next-intl** 国际化（默认 en / zh / ja / ar / th / vi / id）
- **Content Collections**（JSON + Zod，内容随 git 版本化）
- **Tailwind CSS v4**

## 本地开发

需要 Node 22+。

```bash
npm install
npm run dev      # http://localhost:3000
```

| 命令 | 说明 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | Next 构建 |
| `npm run preview` | OpenNext + workerd 本地预览（最贴近线上） |
| `npm run deploy` | 构建并部署到 Cloudflare |

## 内容维护

- **产品**：`content/products/*.json`（字段见 `content-collections.ts`）
- **页面**：`content/pages/*.json`（首页 hero、关于我们等）
- **界面文案**：`messages/<locale>.json`

多语言文案内嵌在字段里（`{ "en": "...", "zh": "..." }`），英文必填。产品的 `translatedLocales` 列出已完成翻译的语言——**只有这些语言会生成页面并进入 hreflang/sitemap**，未译语言不生成（返回 404），避免英文内容冒充翻译损害 SEO。

## 部署到 Cloudflare

1. 修改 `src/lib/site.ts` 的 `url` 与 `src/app/[locale]/layout.tsx` 的 `metadataBase` 为正式域名。
2. `npx wrangler login`
3. `npm run deploy`（或在 Cloudflare 控制台连接 GitHub 仓库，开启 Workers Builds 自动部署）。

## 路线图

- [x] **第一期** — 公司/产品内容展示 + 独立 SEO 详情页 + 外部平台下单跳转
- [ ] **第二期** — 在线询盘（D1 + Resend + Turnstile）
- [ ] **第三期** — 自有支付（Stripe）

开发约定与各期实施要点见 [CLAUDE.md](./CLAUDE.md)。
