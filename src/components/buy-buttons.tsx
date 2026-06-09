import { getTranslations } from "next-intl/server";
import { SITE, type BuyPlatformKey } from "@/lib/site";
import { ArrowUpRight } from "./icons";
import type { Product } from "@/lib/products";

export async function BuyButtons({ buyLinks }: { buyLinks: Product["buyLinks"] }) {
  const t = await getTranslations("product");

  const links = (Object.keys(SITE.platforms) as BuyPlatformKey[])
    .filter((key) => Boolean(buyLinks[key]))
    .map((key) => ({ key, label: SITE.platforms[key], url: buyLinks[key]! }));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {links.map(({ key, label, url }, i) => {
        const primary = i === 0;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={[
              "group inline-flex items-center justify-between gap-4 rounded-full py-2 ps-6 pe-2 text-base font-medium transition-colors",
              primary
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-transparent text-foreground ring-1 ring-border hover:bg-foreground/[0.04]",
            ].join(" ")}
          >
            <span>{t("buyOn", { platform: label })}</span>
            <span
              className={[
                "grid size-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5",
                primary ? "bg-background/15" : "bg-foreground/[0.06]",
              ].join(" ")}
            >
              <ArrowUpRight className="size-4 flip-rtl" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
