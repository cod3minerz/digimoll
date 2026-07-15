import { Typography } from "@heroui/react";
import { catalogCategories, catalogProductsByCategory } from "@/lib/mock-data";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="app-shell section-gap">
        <Typography type="h2">Каталог</Typography>
        {catalogCategories.map((category) => (
          <section key={category.slug} id={category.slug} className="shop-section">
            <Typography type="h3">{category.name}</Typography>
            <div className="shop-grid">
              {catalogProductsByCategory(category.slug).map((product) => (
                <ProductCard
                  key={product.id}
                  href="#topup"
                  id={product.id}
                  name={product.name}
                  originalPrice={product.originalPrice}
                  priceFrom={product.priceFrom}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      <MobileNav />
    </>
  );
}
