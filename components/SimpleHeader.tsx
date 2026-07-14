import type { ReactNode } from "react";
import { Link as HeroLink } from "@heroui/react";

export function SimpleHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="app-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <HeroLink href="/">
          <img alt="Digimoll" className="h-9 w-auto" src="/fullLogo.svg" />
        </HeroLink>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
