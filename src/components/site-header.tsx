import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";

export async function SiteHeader() {
  const t = await getTranslations("nav");

  const nav = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/about", label: t("about") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          {SITE.name}
        </Link>

        <nav
          aria-label={t("products")}
          className="order-last w-full sm:order-none sm:w-auto"
        >
          <ul className="flex items-center gap-6 text-sm text-foreground/75">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md py-1 transition-colors hover:text-foreground focus:outline-none focus-visible:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
