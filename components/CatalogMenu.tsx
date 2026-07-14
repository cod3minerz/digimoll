"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@heroui/react";
import { ArrowRightIcon, Squares2X2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { categories, formatRub, productById } from "@/lib/mock-data";
import { ProductMark } from "@/components/ProductIcon";

function CatalogGrid({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="catalog-menu-grid">
      {categories.map((category) => {
        const product = productById(category.featuredProductId);

        return (
          <a
            key={category.id}
            className="catalog-menu-card"
            data-category={category.id}
            href="/#topup"
            onClick={() => onNavigate?.()}
          >
            <ProductMark product={product} />
            <span className="catalog-menu-card-info">
              <span className="catalog-menu-card-name">{category.name}</span>
              <span className="catalog-menu-card-subtitle">{category.subtitle}</span>
              <span className="catalog-menu-card-price">от {formatRub(category.priceFrom)}</span>
            </span>
            <ArrowRightIcon aria-hidden="true" className="ui-icon catalog-menu-card-arrow" />
          </a>
        );
      })}
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
      </div>
    </div>
  );
}

export function CatalogSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="catalog-sheet-backdrop"
        data-open={isOpen}
        onClick={() => onOpenChange(false)}
      />
      <div aria-label="Каталог" className="catalog-sheet" data-open={isOpen} role="dialog">
        <div className="catalog-sheet-handle" />
        <div className="catalog-sheet-head">
          <span className="catalog-sheet-title">Каталог</span>
          <button
            aria-label="Закрыть каталог"
            className="catalog-sheet-close"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <XMarkIcon className="ui-icon" />
          </button>
        </div>
        <div className="catalog-sheet-body">
          <CatalogGrid onNavigate={() => onOpenChange(false)} />
        </div>
      </div>
    </>,
    document.body,
  );
}
