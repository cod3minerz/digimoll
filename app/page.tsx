"use client";

import { type ComponentType, type SVGProps, useEffect, useRef, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Chip,
  Description,
  Dropdown,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Link as HeroLink,
  NumberField,
  ProgressBar,
  ScrollShadow,
  SearchField,
  Select,
  Separator,
  Surface,
  Tabs,
  TextField,
  Typography,
} from "@heroui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  IdentificationIcon,
  MinusIcon,
  PaperAirplaneIcon,
  PlusIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Squares2X2Icon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  categories,
  faqItems,
  products,
  promoSlides,
  type Product,
} from "@/lib/mock-data";

type OrderStatus = "idle" | "created" | "paid" | "processing" | "delivered" | "error";
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

const quickProductIds = ["steam-wallet", "telegram-stars", "telegram-premium", "robux"];
const quickProducts = quickProductIds.map((id) => productById(id));
const serviceIconAsset: Record<string, string> = {
  "steam-wallet": "/icons/steam.svg",
  "telegram-stars": "/icons/tg-stars.svg",
  "telegram-premium": "/icons/tg-premium.svg",
  robux: "/icons/robux.svg",
};

const showcaseSlides = [
  {
    id: "ai",
    eyebrow: "AI и подписки",
    title: "Оплачивайте зарубежные сервисы в рублях",
    mobileTitle: "Сервисы в рублях",
    text: "ChatGPT, Midjourney, Apple, Google и другие сервисы без карт, крипты и сложных инструкций.",
    cta: "Выбрать сервис",
    products: ["telegram-premium", "steam-wallet", "telegram-stars"],
  },
  {
    id: "games",
    eyebrow: "Игры и валюта",
    title: "Игры, подписки и пополнения без лишних шагов",
    mobileTitle: "Игры без лишних шагов",
    text: "Steam, Robux, Stars и игровые сервисы с понятной оплатой и быстрой выдачей.",
    cta: "Пополнить баланс",
    products: ["steam-wallet", "robux", "telegram-stars"],
  },
];

const serviceShelf = [
  { id: "telegram-premium", label: "Telegram" },
  { id: "robux", label: "Robux", badge: "Новое" },
  { id: "telegram-stars", label: "Stars", badge: "Новое" },
  { id: "steam-wallet", label: "Steam" },
  { id: "chatgpt", label: "ChatGPT", fallback: SparklesIcon, badge: "Новое" },
  { id: "playstation", label: "PS Plus", fallback: PuzzlePieceIcon },
  { id: "apple", label: "App Store", fallback: DevicePhoneMobileIcon },
  { id: "software", label: "VPN", fallback: ComputerDesktopIcon },
  { id: "gift", label: "Карты", fallback: GiftIcon },
];

const shelfLabelById: Record<string, string> = Object.fromEntries(
  serviceShelf.map((item) => [item.id, item.label]),
);

const statusCopy: Record<OrderStatus, string> = {
  idle: "Готово к оплате",
  created: "Заказ создан",
  paid: "Оплата получена",
  processing: "В обработке",
  delivered: "Доставлено",
  error: "Нужна поддержка",
};

const amountProductConfig: Record<
  string,
  { label: string; min: number; max: number; step: number; defaultValue: number; unit: string; unitPrice: number }
> = {
  "steam-wallet": {
    label: "Сумма пополнения",
    min: 150,
    max: 50000,
    step: 50,
    defaultValue: 1000,
    unit: "₽",
    unitPrice: 1,
  },
  "telegram-stars": {
    label: "Количество Stars",
    min: 100,
    max: 50000,
    step: 50,
    defaultValue: 500,
    unit: "Stars",
    unitPrice: 1,
  },
  robux: {
    label: "Количество Robux",
    min: 80,
    max: 25000,
    step: 10,
    defaultValue: 500,
    unit: "Robux",
    unitPrice: 1.39,
  },
};

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function productById(id: string) {
  return products.find((product) => product.id === id) ?? products[0];
}

const categoryIconMap: Record<Product["category"], HeroIcon> = {
  games: PuzzlePieceIcon,
  ai: SparklesIcon,
  subscriptions: DevicePhoneMobileIcon,
  software: ComputerDesktopIcon,
  telegram: PaperAirplaneIcon,
  giftCards: GiftIcon,
};

function ProductMark({ product }: { product: Product }) {
  const asset = serviceIconAsset[product.id];
  const Icon = categoryIconMap[product.category];

  return (
    <span aria-hidden="true" className="service-mark">
      {asset ? <img alt="" src={asset} /> : <Icon />}
    </span>
  );
}

function ServiceIcon({ product, className = "topup-tab-icon" }: { product: Product; className?: string }) {
  return (
    <span aria-hidden="true" className={className} data-product={product.id}>
      <img alt="" className="topup-service-img" src={serviceIconAsset[product.id] ?? product.iconAsset} />
    </span>
  );
}

function ShelfIcon({ item }: { item: (typeof serviceShelf)[number] }) {
  const product = products.find((entry) => entry.id === item.id);
  const Icon = item.fallback ?? SparklesIcon;

  return (
    <span aria-hidden="true" className="topup-shelf-icon" data-product={item.id}>
      {product || serviceIconAsset[item.id] ? (
        <img alt="" className="topup-service-img" src={serviceIconAsset[item.id] ?? product?.iconAsset} />
      ) : (
        <Icon />
      )}
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="app-shell flex min-h-20 items-center gap-4 py-3">
        <HeroLink className="shrink-0" href="/">
          <img alt="Digimoll" className="h-9 w-auto" src="/fullLogo.svg" />
        </HeroLink>

        <Dropdown>
          <Button className="header-catalog hidden min-[901px]:flex" variant="secondary">
            <Squares2X2Icon aria-hidden="true" className="ui-icon" />
            Каталог
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu className="min-w-72">
              {categories.map((category) => (
                <Dropdown.Item key={category.id} id={category.id} textValue={category.name}>
                  <Label>{category.name}</Label>
                  <Description>{category.subtitle}</Description>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        <SearchField aria-label="Поиск игр и приложений" className="header-search flex flex-1" name="search">
          <SearchField.Group className="header-search-group">
            <SearchField.SearchIcon className="header-search-icon" />
            <SearchField.Input placeholder="Поиск игр и приложений" />
            <SearchField.ClearButton className="header-search-clear" />
          </SearchField.Group>
        </SearchField>

        <div className="header-actions ml-auto hidden min-[901px]:flex">
          <Button className="header-action" variant="secondary" onPress={() => (window.location.href = "/account")}>
            <CurrencyDollarIcon aria-hidden="true" className="header-action-icon header-action-icon--brand" />
            <span className="header-action-label">DigiCoins</span>
          </Button>
          <Button className="header-action" variant="secondary">
            <PaperAirplaneIcon aria-hidden="true" className="header-action-icon" />
            <span className="header-action-label">Telegram-бот</span>
          </Button>
          <Button className="header-action" variant="secondary" onPress={() => (window.location.href = "/account")}>
            <UserIcon aria-hidden="true" className="header-action-icon" />
            <span className="header-action-label">Войти</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const items = [
    { id: "home", label: "Главная", icon: HomeIcon, href: "/", active: true },
    { id: "catalog", label: "Каталог", icon: Squares2X2Icon, href: "#topup", active: false },
    { id: "favorites", label: "Избранное", icon: HeartIcon, href: "#topup", active: false },
    { id: "profile", label: "Профиль", icon: UserIcon, href: "/account", active: false },
  ];

  return (
    <nav aria-label="Основная навигация" className="mobile-nav">
      {items.map((item) => (
        <HeroLink key={item.id} className="mobile-nav-item" data-active={item.active} href={item.href}>
          <item.icon aria-hidden="true" className="mobile-nav-icon" />
          <span>{item.label}</span>
        </HeroLink>
      ))}
    </nav>
  );
}

function QuickTopUp() {
  const [selectedId, setSelectedId] = useState("steam-wallet");
  const selectedProduct = productById(selectedId);
  const [login, setLogin] = useState("");
  const [tariffId, setTariffId] = useState(selectedProduct.tariffs[0].id);
  const [amount, setAmount] = useState<number | undefined>(amountProductConfig[selectedId]?.defaultValue);
  const [status, setStatus] = useState<OrderStatus>("idle");

  const tariff = selectedProduct.tariffs.find((item) => item.id === tariffId) ?? selectedProduct.tariffs[0];
  const amountConfig = amountProductConfig[selectedId];
  const isSubscription = !amountConfig;
  const total = isSubscription ? tariff.price : Math.round((amount ?? 0) * amountConfig.unitPrice);
  const hasLogin = login.trim().length > 2;
  const hasAmount = isSubscription || ((amount ?? 0) >= amountConfig.min);
  const progress = status === "delivered" ? 100 : hasLogin && hasAmount ? 66 : hasLogin ? 33 : 0;
  const formLabel =
    selectedProduct.category === "telegram"
      ? "Логин Telegram"
      : selectedProduct.skuType === "code"
        ? "Логин / email аккаунта"
        : "Логин / UID";
  const inputPlaceholder = selectedProduct.category === "telegram" ? "username" : "Ваш логин";
  const checkoutTitle =
    selectedId === "steam-wallet"
      ? "Пополнить баланс"
      : selectedId === "telegram-stars"
        ? "Купить звёзды"
        : selectedId === "robux"
          ? "Промокоды Robux"
          : "Telegram Premium";

  const chooseProduct = (id: string) => {
    const next = productById(id);
    setSelectedId(id);
    setTariffId(next.tariffs[0].id);
    setAmount(amountProductConfig[id]?.defaultValue);
    setStatus("idle");
  };

  const submitOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasLogin || !hasAmount) return;

    setStatus("created");
    window.setTimeout(() => setStatus("paid"), 650);
    window.setTimeout(() => setStatus("processing"), 1300);
    window.setTimeout(() => setStatus("delivered"), 2100);
  };

  return (
    <section className="app-shell topup-showcase" id="topup">
      <ScrollShadow hideScrollBar className="topup-banner-carousel">
        {showcaseSlides.map((slide, index) => (
          <Card key={slide.id} className="topup-banner-card" data-tone={slide.id} variant="secondary">
            <Card.Content>
              <div className="topup-banner-copy">
                <Chip color={index === 0 ? "accent" : "success"} size="sm" variant="soft">
                  {slide.eyebrow}
                </Chip>
                <Typography type="h1">
                  <span className="topup-title-desktop">{slide.title}</span>
                  <span className="topup-title-mobile">{slide.mobileTitle}</span>
                </Typography>
                <Typography color="muted" type="body-sm">{slide.text}</Typography>
                <Button className="topup-banner-button" size="sm" variant="primary" onPress={() => chooseProduct(slide.products[0])}>
                  {slide.cta}
                </Button>
              </div>
              <div className="topup-banner-icons" aria-hidden="true">
                {slide.products.map((id) => (
                  <ServiceIcon key={id} className="topup-banner-icon" product={productById(id)} />
                ))}
              </div>
              <div className="topup-banner-progress" aria-hidden="true">
                {showcaseSlides.map((item, dotIndex) => (
                  <span key={item.id} data-active={dotIndex === index} />
                ))}
              </div>
            </Card.Content>
          </Card>
        ))}
      </ScrollShadow>

      <ScrollShadow hideScrollBar className="topup-shelf">
        {serviceShelf.map((item) => {
          const isQuick = quickProductIds.includes(item.id);
          const selected = selectedId === item.id;
          return (
            <Button
              key={item.id}
              className="topup-shelf-item"
              data-selected={selected}
              isDisabled={!isQuick}
              variant="ghost"
              onPress={() => isQuick && chooseProduct(item.id)}
            >
              {item.badge ? (
                <Chip className="topup-shelf-badge" color="success" size="sm" variant="primary">
                  {item.badge}
                </Chip>
              ) : null}
              <ShelfIcon item={item} />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </ScrollShadow>

      <Surface className="topup-checkout" variant="secondary">
        <Tabs
          className="topup-mode-tabs"
          selectedKey={selectedId}
          onSelectionChange={(key) => chooseProduct(String(key))}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Тип пополнения">
              {quickProducts.map((product) => (
                <Tabs.Tab key={product.id} id={product.id}>
                  <ServiceIcon className="topup-mode-icon" product={product} />
                  <span className="topup-mode-label">{shelfLabelById[product.id] ?? product.name}</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
          {quickProducts.map((product) => (
            <Tabs.Panel key={product.id} className="hidden" id={product.id}>
              <span className="sr-only">{product.name}</span>
            </Tabs.Panel>
          ))}
        </Tabs>

        <div className="topup-checkout-heading">
          <Typography type="h3">{checkoutTitle}</Typography>
          <Typography color="muted" type="body-sm">
            {isSubscription ? "Автовыдача · выберите срок" : `Автовыдача · ${selectedProduct.deliveryEta}`}
          </Typography>
        </div>

        <Form className="topup-checkout-form" onSubmit={submitOrder}>
          <div className={isSubscription ? "topup-checkout-fields topup-checkout-fields--subscription" : "topup-checkout-fields"}>
            <TextField
              isRequired
              fullWidth
              className="topup-login-field"
              isInvalid={login.length > 0 && !hasLogin}
              name="login"
              value={login}
              onChange={setLogin}
            >
              <Label className="topup-section-label">{formLabel}</Label>
              <Input className="topup-input" placeholder={inputPlaceholder} variant="secondary" />
              {login.length > 0 && !hasLogin ? (
                <FieldError>Введите минимум 3 символа.</FieldError>
              ) : null}
            </TextField>

            {!isSubscription ? (
              <NumberField
                isRequired
                fullWidth
                className="topup-amount-field"
                isInvalid={amount !== undefined && !hasAmount}
                maxValue={amountConfig.max}
                minValue={amountConfig.min}
                name="amount"
                step={amountConfig.step}
                value={amount}
                variant="secondary"
                onChange={setAmount}
              >
                <Label className="topup-section-label">{amountConfig.label}</Label>
                <NumberField.Group className="topup-number-group">
                  <NumberField.DecrementButton className="topup-stepper-button">
                    <MinusIcon aria-hidden="true" />
                  </NumberField.DecrementButton>
                  <NumberField.Input className="topup-number-input" />
                  <span className="topup-number-unit">{amountConfig.unit}</span>
                  <NumberField.IncrementButton className="topup-stepper-button">
                    <PlusIcon aria-hidden="true" />
                  </NumberField.IncrementButton>
                </NumberField.Group>
                {amount !== undefined && !hasAmount ? (
                  <FieldError>
                    Минимум {amountConfig.min.toLocaleString("ru-RU")} {amountConfig.unit}.
                  </FieldError>
                ) : null}
              </NumberField>
            ) : (
              <Select
                isRequired
                fullWidth
                className="topup-tariff-select"
                name="tariff"
                placeholder="Выберите срок"
                value={tariffId}
                variant="secondary"
                onChange={(key) => key && setTariffId(String(key))}
              >
                <Label className="topup-section-label">Срок подписки</Label>
                <Select.Trigger className="topup-select-trigger">
                  <Select.Value>
                    {({ defaultChildren, isPlaceholder }) => {
                      if (isPlaceholder) return defaultChildren;

                      return (
                        <span className="topup-select-value">
                          <span>{tariff.title}</span>
                          <span>{formatRub(tariff.price)}</span>
                        </span>
                      );
                    }}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="topup-select-popover">
                  <ListBox>
                    {selectedProduct.tariffs.map((item) => (
                      <ListBox.Item
                        key={item.id}
                        id={item.id}
                        className="topup-select-option"
                        textValue={`${item.title} ${formatRub(item.price)}`}
                      >
                        <span className="topup-select-option-main">
                          <span>{item.title}</span>
                          <span>{formatRub(item.price)}</span>
                        </span>
                        {item.discountLabel ? (
                          <Chip className="topup-select-discount" color="success" size="sm" variant="soft">
                            {item.discountLabel}
                          </Chip>
                        ) : null}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          </div>

          {status !== "idle" ? (
            <ProgressBar aria-label="Статус заказа" value={progress || 30}>
              <Label>{statusCopy[status]}</Label>
              <ProgressBar.Output />
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          ) : null}

          <div className="topup-payline">
            <Chip className="topup-cashback-badge" color="accent" size="sm" variant="soft">
              <CurrencyDollarIcon aria-hidden="true" className="ui-icon" />
              +3% в DigiCoins
            </Chip>
            <Button
              fullWidth
              className="topup-cta"
              isPending={status !== "idle" && status !== "delivered"}
              size="lg"
              type="submit"
            >
              Оплатить {formatRub(total)}
            </Button>
          </div>
        </Form>
      </Surface>
    </section>
  );
}

function PromoCarousel() {
  const promoRailRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const rail = promoRailRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollPrev(rail.scrollLeft > 8);
    setCanScrollNext(rail.scrollLeft < maxScroll - 8);
    const fraction = maxScroll > 8 ? rail.scrollLeft / maxScroll : 0;
    setActiveIndex(Math.round(fraction * (promoSlides.length - 1)));
  };

  useEffect(() => {
    const rail = promoRailRef.current;
    if (!rail) return;

    updateScrollState();
    rail.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollPromos = (direction: -1 | 1) => {
    const rail = promoRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.86, behavior: "smooth" });
  };

  return (
    <section className="app-shell promo-section">
      <Surface className="promo-surface" variant="transparent">
        <div className="promo-head">
          <div className="promo-heading">
            <span aria-hidden="true" className="promo-heading-icon">
              <TagIcon className="ui-icon" />
            </span>
            <div className="promo-heading-copy">
              <Typography type="h3">Актуальные предложения</Typography>
            </div>
          </div>
        </div>

        <div className="promo-rail-wrap">
          <Button
            aria-label="Предыдущие предложения"
            className="promo-nav promo-nav--prev"
            isDisabled={!canScrollPrev}
            isIconOnly
            variant="secondary"
            onPress={() => scrollPromos(-1)}
          >
            <ArrowLeftIcon aria-hidden="true" className="ui-icon" />
          </Button>

          <ScrollShadow
            ref={promoRailRef}
            hideScrollBar
            className="promo-rail"
            orientation="horizontal"
            size={64}
          >
            {promoSlides.map((slide) => (
              <Card key={slide.id} className="promo-card" data-glow={slide.glow} variant="tertiary">
                <Card.Header>
                  <Chip className="promo-card-badge" size="sm" variant="soft">
                    {slide.label}
                  </Chip>
                  <Card.Title>{slide.title}</Card.Title>
                  <Card.Description>{slide.text}</Card.Description>
                </Card.Header>
                <div className="promo-card-footer">
                  <Chip color={slide.meta.startsWith("-") ? "warning" : "default"} size="sm" variant="soft">
                    {slide.meta}
                  </Chip>
                  <Button
                    isIconOnly
                    aria-label={`Открыть ${slide.title}`}
                    className="promo-card-action"
                    size="sm"
                    variant="secondary"
                    onPress={() => (window.location.href = "#topup")}
                  >
                    <ArrowRightIcon aria-hidden="true" className="ui-icon" />
                  </Button>
                </div>
                <img alt="" aria-hidden="true" className="promo-card-art" src={slide.art} />
              </Card>
            ))}
          </ScrollShadow>

          <Button
            aria-label="Следующие предложения"
            className="promo-nav promo-nav--next"
            isDisabled={!canScrollNext}
            isIconOnly
            variant="secondary"
            onPress={() => scrollPromos(1)}
          >
            <ArrowRightIcon aria-hidden="true" className="ui-icon" />
          </Button>
        </div>

        <div className="promo-dots" aria-hidden="true">
          {promoSlides.map((slide, index) => (
            <span key={slide.id} data-active={index === activeIndex} />
          ))}
        </div>
      </Surface>
    </section>
  );
}

function CategoriesGrid() {
  const trustItems = ["Безопасная сделка", "Мгновенная доставка", "Поддержка 24/7"];

  return (
    <section className="app-shell categories-section">
      <div className="categories-head">
        <Chip color="accent" size="sm" variant="soft">
          Каталог
        </Chip>
        <Typography type="h2">Категории</Typography>
        <Typography color="muted" type="body">Выберите категорию и найдите нужный цифровой товар за пару кликов</Typography>
      </div>

      <div className="categories-grid">
        {categories.map((category) => {
          const product = productById(category.featuredProductId);

          return (
            <Card key={category.id} className="category-card" data-category={category.id} variant="tertiary">
              <Card.Header>
                <ProductMark product={product} />
                <div>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Description>{category.subtitle}</Card.Description>
                </div>
              </Card.Header>
              <Card.Footer>
                <Chip color="default" variant="soft">от {formatRub(category.priceFrom)}</Chip>
                <Button isIconOnly aria-label={`Открыть ${category.name}`} variant="secondary" onPress={() => (window.location.href = "#topup")}>
                  <ArrowRightIcon aria-hidden="true" className="ui-icon" />
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>

      <Surface className="categories-trust" variant="secondary">
        {trustItems.map((item) => (
          <Chip key={item} color="accent" variant="soft">
            {item}
          </Chip>
        ))}
      </Surface>
    </section>
  );
}

function FAQ() {
  return (
    <section className="app-shell section-gap">
      <Typography align="center" type="h2">Частые вопросы</Typography>
      <Typography align="center" color="muted" type="body">
        Ответы на самые популярные вопросы о покупке и использовании товаров на Digimoll.
      </Typography>
      <Accordion className="mx-auto mt-6 max-w-5xl" variant="surface">
        {faqItems.map((item) => (
          <Accordion.Item key={item.title}>
            <Accordion.Heading>
              <Accordion.Trigger>
                {item.title}
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>{item.content}</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  const shopLinks = ["Steam", "Telegram Stars", "Telegram Premium", "Robux", "Все категории"];
  const infoLinks = ["Как купить", "Доставка и оплата", "Гарантии и возврат", "Отзывы", "FAQ"];
  const socialLinks = [
    { label: "Telegram", icon: PaperAirplaneIcon, href: "#topup", primary: true },
    { label: "VK", asset: "/social/vk.svg", href: "#topup" },
    { label: "Discord", asset: "/social/discord.svg", href: "#topup" },
  ];
  const paymentLogos = [
    { label: "МИР", src: "/payments/mir.svg" },
    { label: "Visa", src: "/payments/visa.svg" },
    { label: "Mastercard", src: "/payments/mastercard.svg" },
    { label: "СБП", src: "/payments/sbp.svg" },
  ];
  const requisites = [
    { label: "ИП Иванов И.И.", icon: UserIcon },
    { label: "ИНН 123456789012", icon: IdentificationIcon },
    { label: "ОГРНИП 123456789012345", icon: ShieldCheckIcon },
    { label: "hello@digimoll.ru", icon: EnvelopeIcon },
  ];

  return (
    <footer className="app-shell footer-section">
      <Surface className="footer-surface" variant="secondary">
        <div className="footer-main">
          <div className="footer-brand">
            <img alt="Digimoll" className="footer-logo" src="/fullLogo.svg" />
            <Typography color="muted" type="body-sm">
              Цифровой маркетплейс аккаунтов, подписок и цифровых товаров с моментальной доставкой.
            </Typography>
            <Chip className="footer-safe-badge" color="accent" variant="soft">
              <ShieldCheckIcon aria-hidden="true" className="ui-icon" />
              Безопасные покупки
            </Chip>

            <div className="footer-socials">
              <Typography type="h5">Мы в соцсетях</Typography>
              <div className="footer-social-buttons">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      className="footer-social-button"
                      variant={item.primary ? "primary" : "secondary"}
                      onPress={() => (window.location.href = item.href)}
                    >
                      {Icon ? <Icon aria-hidden="true" className="ui-icon" /> : <img alt="" src={item.asset} />}
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Магазин">
            <Typography type="h5">Магазин</Typography>
            <div>
              {shopLinks.map((item) => (
                <HeroLink key={item} href="#topup">{item}</HeroLink>
              ))}
            </div>
          </nav>

          <nav className="footer-nav" aria-label="Информация">
            <Typography type="h5">Информация</Typography>
            <div>
              {infoLinks.map((item) => (
                <HeroLink key={item} href="#topup">{item}</HeroLink>
              ))}
            </div>
          </nav>

          <div className="footer-support">
            <Card className="footer-support-card" variant="tertiary">
              <Card.Header>
                <ChatBubbleLeftRightIcon aria-hidden="true" className="footer-support-icon" />
                <div>
                  <Card.Title>Поддержка 24/7</Card.Title>
                  <Card.Description>Мы всегда на связи и готовы помочь</Card.Description>
                </div>
              </Card.Header>
              <Card.Footer>
                <Button fullWidth>
                  <PaperAirplaneIcon aria-hidden="true" className="ui-icon" />
                  Telegram: @digimoll_support
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </div>

        <Separator className="footer-separator" />

        <div className="footer-payments-row">
          <div className="footer-payments">
            <Typography type="body-sm">Мы принимаем</Typography>
            <div>
              {paymentLogos.map((item) => (
                <span key={item.label} className="footer-payment-logo">
                  <img alt={item.label} src={item.src} />
                </span>
              ))}
            </div>
          </div>

          <div className="footer-requisites">
            {requisites.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="footer-requisite-item">
                  <Icon aria-hidden="true" />
                  <Typography color="muted" type="body-sm">{item.label}</Typography>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="footer-separator footer-separator--low" />

        <div className="footer-bottom">
          <Typography color="muted" type="body-sm">© 2026 Digimoll — Все права защищены</Typography>
          <Typography color="muted" type="body-sm">Покупая у нас, вы соглашаетесь с условиями использования сервиса</Typography>
        </div>
      </Surface>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <QuickTopUp />
        <PromoCarousel />
        <CategoriesGrid />
        <FAQ />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
