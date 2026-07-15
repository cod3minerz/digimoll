"use client";

import { usePathname } from "next/navigation";
import { Link as HeroLink } from "@heroui/react";
import { HeartIcon, HomeIcon, Squares2X2Icon, UserIcon } from "@heroicons/react/24/solid";

const navItems = [
  { id: "home", label: "Главная", icon: HomeIcon, href: "/" },
  { id: "catalog", label: "Каталог", icon: Squares2X2Icon, href: "/catalog" },
  { id: "favorites", label: "Избранное", icon: HeartIcon, href: "/favorites" },
  { id: "profile", label: "Профиль", icon: UserIcon, href: "/account" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация" className="mobile-nav">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <HeroLink key={item.id} className="mobile-nav-item" data-active={isActive} href={item.href}>
            <item.icon aria-hidden="true" className="mobile-nav-icon" />
            <span>{item.label}</span>
          </HeroLink>
        );
      })}
    </nav>
  );
}
