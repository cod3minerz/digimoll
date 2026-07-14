"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SearchField } from "@heroui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { popularProducts, popularSearches, products } from "@/lib/mock-data";
import { ProductMark } from "@/components/ProductIcon";

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

const suggestedProducts = popularProducts
  .map((entry) => products.find((product) => product.id === entry.productId))
  .filter((product): product is NonNullable<typeof product> => Boolean(product))
  .slice(0, 4);

export function SearchBar({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setIsOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (!next) {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={containerRef} className={`search-bar${open ? " search-bar--open" : ""}`}>
      {mounted
        ? createPortal(
            <div aria-hidden="true" className="search-backdrop" data-open={open} onClick={() => setIsOpen(false)} />,
            document.body,
          )
        : null}
      <SearchField
        aria-label="Поиск игр и приложений"
        className="header-search flex flex-1"
        name="search"
        value={value}
        onChange={setValue}
      >
        <SearchField.Group className="header-search-group">
          <SearchField.SearchIcon className="header-search-icon" />
          <SearchField.Input
            ref={inputRef}
            placeholder="Поиск игр и приложений"
            onFocus={() => setIsOpen(true)}
          />
          <SearchField.ClearButton className="header-search-clear" />
        </SearchField.Group>
      </SearchField>

      {open ? (
        <button
          aria-label="Закрыть поиск"
          className="search-bar-close"
          type="button"
          onClick={() => {
            setValue("");
            setIsOpen(false);
          }}
        >
          <XMarkIcon className="ui-icon" />
        </button>
      ) : null}

      <div className="search-panel" data-open={open}>
        <div className="search-panel-section">
          <span className="search-panel-title">Популярные запросы</span>
          <div className="search-panel-chips">
            {popularSearches.map((term) => (
              <button
                key={term}
                className="search-panel-chip"
                type="button"
                onClick={() => {
                  setValue(term);
                  inputRef.current?.focus();
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="search-panel-section">
          <span className="search-panel-title">Популярные товары</span>
          <div className="search-panel-products">
            {suggestedProducts.map((product) => (
              <a
                key={product.id}
                className="search-panel-product"
                href="#topup"
                onClick={() => setIsOpen(false)}
              >
                <ProductMark product={product} />
                <span className="search-panel-product-info">
                  <span className="search-panel-product-name">{product.name}</span>
                  <span className="search-panel-product-price">от {formatRub(product.priceFrom)}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
