"use client";

import { useState } from "react";
import { Button, Link as HeroLink } from "@heroui/react";
import { CurrencyDollarIcon, UserIcon } from "@heroicons/react/24/solid";
import { SearchBar } from "@/components/SearchBar";
import { CatalogMegaMenu } from "@/components/CatalogMenu";
import { TelegramIcon } from "@/components/ProductIcon";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div
        className="app-shell flex min-h-20 items-center gap-4 py-3 header-row"
        data-search-open={searchOpen}
      >
        <HeroLink className="shrink-0 header-logo" href="/">
          <img alt="Digimoll" className="h-9 w-auto" src="/fullLogo.svg" />
        </HeroLink>

        <CatalogMegaMenu />

        <SearchBar onOpenChange={setSearchOpen} />

        <div className="header-actions ml-auto hidden min-[901px]:flex">
          <Button className="header-action" variant="secondary" onPress={() => (window.location.href = "/account")}>
            <CurrencyDollarIcon aria-hidden="true" className="header-action-icon header-action-icon--brand" />
            <span className="header-action-label font-digicoins">DigiCoins</span>
          </Button>
          <Button className="header-action" variant="secondary">
            <TelegramIcon aria-hidden="true" className="header-action-icon" />
            <span className="header-action-label">Telegram-бот</span>
          </Button>
          <Button className="header-action" variant="secondary" onPress={() => (window.location.href = "/login")}>
            <UserIcon aria-hidden="true" className="header-action-icon" />
            <span className="header-action-label">Войти</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
