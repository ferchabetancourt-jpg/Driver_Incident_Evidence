"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Ensures every route change starts at the top of the page. Without this,
// navigating from a tall page (e.g. a long search results list) to a
// shorter one (e.g. Home) can leave the browser scrolled partway down,
// so the shorter page doesn't fill the viewport and stale content from
// the previous page remains visible below it.
export function ScrollResetOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
