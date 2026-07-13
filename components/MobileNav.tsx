"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Link as HeroLink, Modal } from "@heroui/react";
import { HeartIcon, HomeIcon, LockClosedIcon, Squares2X2Icon, UserIcon } from "@heroicons/react/24/solid";

const navItems = [
  { id: "home", label: "Главная", icon: HomeIcon, href: "/" },
  { id: "catalog", label: "Каталог", icon: Squares2X2Icon, href: "/#categories" },
  { id: "favorites", label: "Избранное", icon: HeartIcon, gated: true },
  { id: "profile", label: "Профиль", icon: UserIcon, href: "/account", gated: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState("/account");
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <>
      <nav aria-label="Основная навигация" className="mobile-nav">
        {navItems.map((item) => {
          const isActive =
            item.id === "catalog"
              ? pathname === "/" && hash === "#categories"
              : item.id === "home"
                ? pathname === "/" && hash !== "#categories"
                : item.href
                  ? pathname === item.href
                  : false;

          if (item.gated) {
            return (
              <button
                key={item.id}
                className="mobile-nav-item"
                data-active={isActive}
                type="button"
                onClick={() => {
                  setPendingHref(item.href ?? "/account");
                  setGateOpen(true);
                }}
              >
                <item.icon aria-hidden="true" className="mobile-nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <HeroLink key={item.id} className="mobile-nav-item" data-active={isActive} href={item.href}>
              <item.icon aria-hidden="true" className="mobile-nav-icon" />
              <span>{item.label}</span>
            </HeroLink>
          );
        })}
      </nav>

      <Modal.Backdrop isOpen={gateOpen} onOpenChange={setGateOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-[360px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <LockClosedIcon className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Нужно войти</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>Чтобы посмотреть этот раздел, сначала войдите в свой аккаунт Digimoll.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Отмена
              </Button>
              <Button onPress={() => (window.location.href = `/login?next=${encodeURIComponent(pendingHref)}`)}>
                Войти
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
