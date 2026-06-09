import { allProducts } from "content-collections";

export type Product = (typeof allProducts)[number];

/** 全部已发布产品，按 order 升序 */
export function getProducts(): Product[] {
  return allProducts
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order);
}

/** 按 slug 取单个已发布产品 */
export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug && !p.draft);
}

/** 精选产品 */
export function getFeatured(): Product[] {
  return getProducts().filter((p) => p.featured);
}

/** 出现过的全部分类 */
export function getCategories(): string[] {
  return [...new Set(getProducts().map((p) => p.category))];
}
