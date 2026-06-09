"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing, localeMeta, type Locale } from "@/i18n/routing";
import { Globe, ChevronDown } from "./icons";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("language")}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.05]"
      >
        <Globe className="size-4" />
        <span>{localeMeta[locale].label}</span>
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          className="absolute end-0 z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.25)]"
        >
          {routing.locales.map((loc) => {
            const active = loc === locale;
            return (
              <li key={loc} role="none">
                <Link
                  href={pathname}
                  locale={loc}
                  role="menuitem"
                  hrefLang={loc}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-foreground/[0.06] font-medium text-foreground"
                      : "text-foreground/80 hover:bg-foreground/[0.04]",
                  ].join(" ")}
                  dir={localeMeta[loc].dir}
                >
                  {localeMeta[loc].label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
