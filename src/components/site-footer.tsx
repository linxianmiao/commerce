import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/site";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const nav = [
    { href: "/products", label: t("nav.products") },
    { href: "/about", label: t("nav.about") },
  ] as const;

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted text-pretty">
            {t("home.featuredSubtitle")}
          </p>
        </div>

        <nav aria-label={t("nav.about")}>
          <ul className="flex gap-6 text-sm text-foreground/75">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-muted">
          © {year} {SITE.name}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
