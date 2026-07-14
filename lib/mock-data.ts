export type SkuType = "uid" | "code" | "subscription";

export type ProductCategory =
  | "games"
  | "ai"
  | "subscriptions"
  | "software"
  | "telegram"
  | "giftCards";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  skuType: SkuType;
  priceFrom: number;
  iconAsset: string;
  deliveryEta: string;
  guaranteeDays?: number;
  regionOptions?: string[];
  tariffs: { id: string; title: string; price: number; discountLabel?: string }[];
};

export type Category = {
  id: ProductCategory;
  name: string;
  subtitle: string;
  priceFrom: number;
  featuredProductId: string;
};

export const products: Product[] = [
  {
    id: "steam-wallet",
    name: "Steam Wallet",
    subtitle: "Пополнение баланса",
    category: "games",
    skuType: "uid",
    priceFrom: 450,
    iconAsset: "SW",
    deliveryEta: "5 минут",
    guaranteeDays: 30,
    tariffs: [
      { id: "steam-450", title: "450 ₽ на баланс", price: 450 },
      { id: "steam-1000", title: "1 000 ₽ на баланс", price: 1000 },
      { id: "steam-2500", title: "2 500 ₽ на баланс", price: 2500, discountLabel: "-3%" },
    ],
  },
  {
    id: "telegram-premium",
    name: "Telegram Premium",
    subtitle: "Premium и Stars",
    category: "telegram",
    skuType: "subscription",
    priceFrom: 1990,
    iconAsset: "TG",
    deliveryEta: "моментально",
    guaranteeDays: 30,
    tariffs: [
      { id: "tg-1", title: "Premium 1 мес", price: 1990 },
      { id: "tg-3", title: "Premium 3 мес", price: 5490, discountLabel: "-8%" },
      { id: "tg-12", title: "Premium 12 мес", price: 18990, discountLabel: "-20%" },
    ],
  },
  {
    id: "telegram-stars",
    name: "Telegram Stars",
    subtitle: "Звезды для аккаунта",
    category: "telegram",
    skuType: "uid",
    priceFrom: 100,
    iconAsset: "TS",
    deliveryEta: "моментально",
    tariffs: [
      { id: "stars-100", title: "100 Stars", price: 100 },
      { id: "stars-500", title: "500 Stars", price: 490 },
      { id: "stars-1000", title: "1 000 Stars", price: 950 },
    ],
  },
  {
    id: "robux",
    name: "Robux",
    subtitle: "Игровая валюта",
    category: "games",
    skuType: "uid",
    priceFrom: 139,
    iconAsset: "RB",
    deliveryEta: "10 минут",
    tariffs: [
      { id: "rb-100", title: "100 Robux", price: 139 },
      { id: "rb-500", title: "500 Robux", price: 649 },
      { id: "rb-1000", title: "1 000 Robux", price: 1190 },
    ],
  },
  {
    id: "ps-plus",
    name: "PS Plus",
    subtitle: "PlayStation без ограничений",
    category: "games",
    skuType: "code",
    priceFrom: 1749,
    iconAsset: "PS",
    deliveryEta: "5 минут",
    guaranteeDays: 30,
    regionOptions: ["Турция", "Украина", "Польша"],
    tariffs: [
      { id: "ps-1", title: "Essential 1 мес", price: 1749 },
      { id: "ps-3", title: "Extra 3 мес", price: 4590 },
      { id: "ps-12", title: "Extra 12 мес", price: 6990, discountLabel: "-12%" },
    ],
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    subtitle: "AI-доступ",
    category: "ai",
    skuType: "subscription",
    priceFrom: 1190,
    iconAsset: "AI",
    deliveryEta: "15 минут",
    guaranteeDays: 30,
    tariffs: [
      { id: "gpt-1", title: "Plus 1 мес", price: 1190 },
      { id: "gpt-3", title: "Plus 3 мес", price: 3490 },
    ],
  },
  {
    id: "apple-id",
    name: "Apple ID",
    subtitle: "Баланс и подписки",
    category: "subscriptions",
    skuType: "code",
    priceFrom: 650,
    iconAsset: "AP",
    deliveryEta: "10 минут",
    regionOptions: ["Турция", "США", "Польша"],
    tariffs: [
      { id: "apple-650", title: "650 ₽", price: 650 },
      { id: "apple-1500", title: "1 500 ₽", price: 1500 },
    ],
  },
  {
    id: "vpn-pack",
    name: "VPN",
    subtitle: "Приватный доступ",
    category: "software",
    skuType: "subscription",
    priceFrom: 299,
    iconAsset: "VP",
    deliveryEta: "моментально",
    tariffs: [
      { id: "vpn-1", title: "1 месяц", price: 299 },
      { id: "vpn-12", title: "12 месяцев", price: 2490, discountLabel: "-30%" },
    ],
  },
  {
    id: "gift-card",
    name: "Подарочные карты",
    subtitle: "Выбрать номинал",
    category: "giftCards",
    skuType: "code",
    priceFrom: 100,
    iconAsset: "GC",
    deliveryEta: "5 минут",
    regionOptions: ["США", "Европа", "Турция"],
    tariffs: [
      { id: "gift-100", title: "100 ₽", price: 100 },
      { id: "gift-1000", title: "1 000 ₽", price: 1000 },
    ],
  },
];

export const categories: Category[] = [
  { id: "games", name: "Игры", subtitle: "Пополнить баланс", priceFrom: 150, featuredProductId: "steam-wallet" },
  { id: "ai", name: "AI-сервисы", subtitle: "Купить доступ", priceFrom: 199, featuredProductId: "chatgpt-plus" },
  { id: "subscriptions", name: "Подписки", subtitle: "Apple, Google, Spotify", priceFrom: 650, featuredProductId: "apple-id" },
  { id: "software", name: "Софт", subtitle: "VPN и облачные сервисы", priceFrom: 299, featuredProductId: "vpn-pack" },
  { id: "telegram", name: "Telegram", subtitle: "Premium и Stars", priceFrom: 100, featuredProductId: "telegram-premium" },
  { id: "giftCards", name: "Подарочные карты", subtitle: "Выбрать номинал", priceFrom: 100, featuredProductId: "gift-card" },
];

export const promoSlides: {
  id: string;
  label: string;
  glow: "green" | "violet" | "blue";
  title: string;
  text: string;
  meta: string;
  art: string;
}[] = [
  {
    id: "spring",
    label: "Акция",
    glow: "green",
    title: "Весенняя акция",
    text: "Скидки до 20% на топовые сервисы",
    meta: "До 31 мая",
    art: "/promo/discount.png",
  },
  {
    id: "robux",
    label: "Новинка",
    glow: "green",
    title: "Robux по лучшей цене",
    text: "Моментальная доставка на аккаунт",
    meta: "Игровая валюта",
    art: "/promo/robux.png",
  },
  {
    id: "telegram",
    label: "Premium",
    glow: "violet",
    title: "Telegram Premium",
    text: "Скидка 8% на подписку 3 месяца",
    meta: "-8%",
    art: "/promo/telegram.png",
  },
  {
    id: "steam",
    label: "Steam",
    glow: "blue",
    title: "Пополнение Steam",
    text: "Комиссия от 3% и быстрое зачисление",
    meta: "Моментальное зачисление",
    art: "/promo/steam.png",
  },
];

export const popularProducts = [
  { productId: "steam-wallet", sales: 12540, tag: "Топ" },
  { productId: "telegram-premium", sales: 9870, tag: "Хит" },
  { productId: "telegram-stars", sales: 8230, tag: "Топ" },
  { productId: "robux", sales: 6410, tag: "Хит" },
  { productId: "ps-plus", sales: 5320, tag: "Топ" },
  { productId: "chatgpt-plus", sales: 4890, tag: "Хит" },
];

export const popularSearches = [
  "Steam пополнение",
  "Telegram Premium",
  "Robux",
  "ChatGPT Plus",
  "PS Plus",
  "VPN",
];

export const reviews = [
  {
    id: "r1",
    name: "Александр",
    product: "Telegram Premium",
    text: "Все пришло моментально, без проблем активировал Premium. Пользуюсь не первый раз.",
    date: "2 дня назад",
  },
  {
    id: "r2",
    name: "Мария",
    product: "Steam Wallet",
    text: "Пополняла Steam кошелек, деньги поступили сразу. Хорошая поддержка.",
    date: "5 дней назад",
  },
  {
    id: "r3",
    name: "Иван",
    product: "Robux",
    text: "Покупаю Robux для сына, все стабильно и быстро.",
    date: "1 неделю назад",
  },
];

export const subscriptions = [
  { id: "sub-1", name: "Telegram Premium", nextDate: "18 июля 2026", autoRenew: true, price: 1990 },
  { id: "sub-2", name: "ChatGPT Plus", nextDate: "02 августа 2026", autoRenew: false, price: 1190 },
  { id: "sub-3", name: "VPN 12 месяцев", nextDate: "11 ноября 2026", autoRenew: true, price: 2490 },
];

export const orders = [
  { id: "DM-10421", service: "Steam Wallet", date: "11 июля 2026", amount: 1000, status: "Доставлено" },
  { id: "DM-10405", service: "Telegram Premium", date: "09 июля 2026", amount: 1990, status: "Доставлено" },
  { id: "DM-10374", service: "ChatGPT Plus", date: "02 июля 2026", amount: 1190, status: "Доставлено" },
  { id: "DM-10318", service: "Robux", date: "25 июня 2026", amount: 649, status: "Доставлено" },
];

export const faqItems = [
  {
    title: "Как быстро приходит товар?",
    content: "Обычно товар приходит моментально после оплаты. В редких случаях доставка может занять до 15 минут.",
  },
  {
    title: "Что делать, если код не сработал?",
    content: "Проверьте регион и правильность ввода. Если ошибка повторяется, напишите в поддержку и приложите скриншот.",
  },
  {
    title: "Безопасно ли вводить логин?",
    content: "Да. Для UID-пополнений нужен только публичный логин или идентификатор, без пароля и кодов доступа.",
  },
  {
    title: "Какие есть способы оплаты?",
    content: "На MVP показываем оплату рублями через карту, СБП и Мир; реальные провайдеры подключаются на backend-этапе.",
  },
  {
    title: "Как работает автопродление?",
    content: "Вы включаете продление в кабинете, Digimoll заранее напоминает о списании и продлевает доступ без ручных действий.",
  },
];

export function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function productById(id: string) {
  return products.find((product) => product.id === id) ?? products[0];
}
