import type { ComponentType, SVGProps } from "react";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  PuzzlePieceIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import type { Product } from "@/lib/mock-data";

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.94 8.19c-.19 2.02-.98 6.9-1.38 9.16-.17.96-.5 1.28-.83 1.31-.71.07-1.24-.47-1.93-.92-1.07-.7-1.68-1.14-2.72-1.82-1.2-.79-.42-1.22.26-1.93.18-.19 3.25-2.98 3.31-3.23a.24.24 0 0 0-.06-.21c-.07-.06-.16-.04-.24-.02-.1.02-1.7 1.08-4.8 3.19-.45.31-.87.46-1.24.45-.41-.01-1.19-.23-1.78-.42-.72-.23-1.29-.35-1.24-.74.03-.2.3-.4.8-.61 3.14-1.37 5.24-2.27 6.29-2.71 3-1.25 3.62-1.47 4.03-1.47.09 0 .29.02.42.13.11.09.14.21.15.3-.01.06.01.24 0 .37Z"
      />
    </svg>
  );
}

export const serviceIconAsset: Record<string, string> = {
  "steam-wallet": "/icons/steam.svg",
  "telegram-stars": "/icons/tg-stars.svg",
  "telegram-premium": "/icons/tg-premium.svg",
  robux: "/icons/robux.svg",
};

export const categoryIconMap: Record<Product["category"], HeroIcon> = {
  games: PuzzlePieceIcon,
  ai: SparklesIcon,
  subscriptions: DevicePhoneMobileIcon,
  software: ComputerDesktopIcon,
  telegram: TelegramIcon,
  giftCards: GiftIcon,
};

export function ProductMark({ product }: { product: Product }) {
  const asset = serviceIconAsset[product.id];
  const Icon = categoryIconMap[product.category];

  return (
    <span aria-hidden="true" className="service-mark">
      {asset ? <img alt="" src={asset} /> : <Icon />}
    </span>
  );
}
