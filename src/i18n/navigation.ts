import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// 本地化的导航 API：自动带/去 locale 前缀，禁止手拼前缀
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
