import type { CSSProperties } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { tx } from "@/lib/i18n-content";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  locale,
  index = 0,
}: {
  product: Product;
  locale: string;
  index?: number;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block animate-fade-up rounded-[1.75rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ "--index": index } as CSSProperties}
    >
      {/* 外层托盘（double-bezel） */}
      <article className="rounded-[1.75rem] bg-foreground/[0.03] p-1.5 ring-1 ring-foreground/[0.06] transition-transform duration-300 ease-out group-hover:-translate-y-1">
        {/* 内层核心 */}
        <div className="overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-surface shadow-[0_20px_45px_-24px_rgba(0,0,0,0.22)]">
          <div className="aspect-square overflow-hidden bg-background">
            <Image
              src={product.heroImage}
              alt={tx(product.name, locale)}
              width={800}
              height={800}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold tracking-tight text-balance">
              {tx(product.name, locale)}
            </h3>
            {product.tagline && (
              <p className="mt-1 text-sm text-muted text-pretty">
                {tx(product.tagline, locale)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
