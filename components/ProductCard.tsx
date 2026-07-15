import { formatRub } from "@/lib/mock-data";

const PLACEHOLDER_TONES = ["tone-a", "tone-b", "tone-c", "tone-d", "tone-e"];

function toneForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % PLACEHOLDER_TONES.length;
  }
  return PLACEHOLDER_TONES[hash];
}

function monogram(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ProductCard({
  id,
  name,
  priceFrom,
  originalPrice,
  href = "#topup",
}: {
  id: string;
  name: string;
  priceFrom: number;
  originalPrice?: number;
  href?: string;
}) {
  const percentOff = originalPrice ? Math.round((1 - priceFrom / originalPrice) * 100) : 0;

  return (
    <a className="product-card" href={href}>
      <div className={`product-card-cover product-card-cover--${toneForId(id)}`}>
        <span className="product-card-monogram" aria-hidden="true">
          {monogram(name)}
        </span>
        {originalPrice ? <span className="product-card-badge">-{percentOff}%</span> : null}
      </div>
      <span className="product-card-name">{name}</span>
      <div className="product-card-price-row">
        <span className="product-card-price" data-discount={Boolean(originalPrice)}>
          от {formatRub(priceFrom)}
        </span>
        {originalPrice ? <span className="product-card-price-old">{formatRub(originalPrice)}</span> : null}
      </div>
    </a>
  );
}
