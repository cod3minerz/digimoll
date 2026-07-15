"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Link as HeroLink } from "@heroui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import { catalogCategories, catalogProductsByCategory, formatRub } from "@/lib/mock-data";

function cheapestPrice(slug: string) {
  const items = catalogProductsByCategory(slug);
  return items.reduce((min, item) => Math.min(min, item.priceFrom), items[0]?.priceFrom ?? 0);
}

function CatalogGrid({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="catalog-menu-grid">
      {catalogCategories.map((category) => (
        <a
          key={category.slug}
          className="catalog-menu-card"
          href={`/catalog#${category.slug}`}
          onClick={() => onNavigate?.()}
        >
          <span className="catalog-menu-mark" data-tone={category.tone}>
            <Squares2X2Icon aria-hidden="true" className="ui-icon" />
          </span>
          <span className="catalog-menu-card-info">
            <span className="catalog-menu-card-name">{category.name}</span>
            <span className="catalog-menu-card-price">от {formatRub(cheapestPrice(category.slug))}</span>
          </span>
          <ArrowRightIcon aria-hidden="true" className="ui-icon catalog-menu-card-arrow" />
        </a>
      ))}
    </div>
  );
}

export function CatalogMegaMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="catalog-mega">
      <Button
        className="header-catalog hidden min-[901px]:flex"
        variant="secondary"
        onPress={() => setOpen((value) => !value)}
      >
        <Squares2X2Icon aria-hidden="true" className="ui-icon" />
        Каталог
      </Button>

      <div className="catalog-mega-panel" data-open={open}>
        <CatalogGrid onNavigate={() => setOpen(false)} />
        <HeroLink className="catalog-mega-footer" href="/catalog" onPress={() => setOpen(false)}>
          Все категории
          <ArrowRightIcon aria-hidden="true" className="ui-icon" />
        </HeroLink>
      </div>
    </div>
  );
}
