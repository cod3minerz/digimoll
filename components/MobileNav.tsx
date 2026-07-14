"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link as HeroLink } from "@heroui/react";
import { HeartIcon, HomeIcon, Squares2X2Icon, UserIcon } from "@heroicons/react/24/solid";
import { CatalogSheet } from "@/components/CatalogMenu";

const navItems = [
  { id: "home", label: "Главная", icon: HomeIcon, href: "/" },
  { id: "catalog", label: "Каталог", icon: Squares2X2Icon },
  { id: "favorites", label: "Избранное", icon: HeartIcon, href: "/favorites" },
  { id: "profile", label: "Профиль", icon: UserIcon, href: "/account" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <>
      <nav aria-label="Основная навигация" className="mobile-nav">
        {navItems.map((item) => {
          if (item.id === "catalog") {
            return (
              <button
                key={item.id}
                className="mobile-nav-item"
                data-active={catalogOpen}
                type="button"
                onClick={() => setCatalogOpen(true)}
              >
                <item.icon aria-hidden="true" className="mobile-nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          }

          const isActive = pathname === item.href;

          return (
            <HeroLink key={item.id} className="mobile-nav-item" data-active={isActive} href={item.href}>
              <item.icon aria-hidden="true" className="mobile-nav-icon" />
              <span>{item.label}</span>
            </HeroLink>
          );
        })}
      </nav>

      <CatalogSheet isOpen={catalogOpen} onOpenChange={setCatalogOpen} />
    </>
  );
}
