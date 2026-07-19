"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Link as HeroLink,
  Modal,
  NumberField,
  Popover,
  ProgressBar,
  ScrollShadow,
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
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import {
  faqItems,
  formatRub,
  productById,
  products,
  promoSlides,
  type Product,
} from "@/lib/mock-data";
import { MobileNav } from "@/components/MobileNav";
import { TelegramIcon, serviceIconAsset } from "@/components/ProductIcon";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";

type OrderStatus = "idle" | "created" | "paid" | "processing" | "delivered" | "error";

const quickProductIds = ["steam-wallet", "telegram-stars", "telegram-premium", "robux"];
const quickProducts = quickProductIds.map((id) => productById(id));

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
  { id: "robux", label: "Robux" },
  { id: "telegram-stars", label: "Stars" },
  { id: "steam-wallet", label: "Steam" },
  { id: "chatgpt", label: "ChatGPT", fallback: SparklesIcon },
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

function QuickTopUp() {
  const [selectedId, setSelectedId] = useState("steam-wallet");
  const selectedProduct = productById(selectedId);
  const [login, setLogin] = useState("");
  const [tariffId, setTariffId] = useState(selectedProduct.tariffs[0].id);
  const [amount, setAmount] = useState<number | undefined>(amountProductConfig[selectedId]?.defaultValue);
  const [status, setStatus] = useState<OrderStatus>("idle");
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const bannerRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = bannerRailRef.current;
    if (!rail || showcaseSlides.length < 2) return;

    let userInteracting = false;
    let resumeTimeout: number | undefined;

    const handlePointerDown = () => {
      userInteracting = true;
      window.clearTimeout(resumeTimeout);
    };
    const handlePointerUp = () => {
      resumeTimeout = window.setTimeout(() => {
        userInteracting = false;
      }, 4000);
    };

    rail.addEventListener("pointerdown", handlePointerDown);
    rail.addEventListener("pointerup", handlePointerUp);

    const interval = window.setInterval(() => {
      if (userInteracting || document.hidden) return;
      const cardWidth = rail.clientWidth;
      const maxScroll = rail.scrollWidth - cardWidth;
      const nextLeft = rail.scrollLeft + cardWidth >= maxScroll - 4 ? 0 : rail.scrollLeft + cardWidth;
      rail.scrollTo({ left: nextLeft, behavior: "smooth" });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resumeTimeout);
      rail.removeEventListener("pointerdown", handlePointerDown);
      rail.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const tariff = selectedProduct.tariffs.find((item) => item.id === tariffId) ?? selectedProduct.tariffs[0];
  const amountConfig = amountProductConfig[selectedId];
  const isSubscription = !amountConfig;
  const total = isSubscription ? tariff.price : Math.round((amount ?? 0) * amountConfig.unitPrice);
  const digicoinsEarned = Math.max(1, Math.round(total * 0.03));
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
  const loginHint =
    selectedProduct.category === "telegram"
      ? "Укажите username вашего Telegram-аккаунта без символа @. Найти его можно в приложении: Настройки → Имя пользователя."
      : selectedProduct.skuType === "code"
        ? "Укажите email аккаунта, на который нужно выдать товар."
        : "Укажите UID вашего профиля Steam — числовой идентификатор из ссылки на профиль в настройках Steam.";
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
      <ScrollShadow ref={bannerRailRef} hideScrollBar className="topup-banner-carousel">
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
          <div className="topup-heading-row">
            <Typography type="h3">{checkoutTitle}</Typography>
            <Chip className="topup-fee-badge" color="accent" size="sm" variant="primary">
              0%
            </Chip>
          </div>
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
              <Label className="topup-floating-label">{formLabel}</Label>
              <Input
                autoComplete="off"
                autoCorrect="off"
                className="topup-input"
                data-1p-ignore
                placeholder=" "
                spellCheck={false}
                variant="secondary"
              />
              <Popover>
                <Button aria-label="Подсказка" className="topup-hint-trigger" isIconOnly type="button" variant="tertiary">
                  <InformationCircleIcon className="ui-icon" />
                </Button>
                <Popover.Content className="max-w-72">
                  <Popover.Dialog>
                    <p>{loginHint}</p>
                  </Popover.Dialog>
                </Popover.Content>
              </Popover>
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
                <NumberField.Group className="topup-number-group">
                  <Label className="topup-floating-label topup-floating-label--static">{amountConfig.label}</Label>
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
                <div className="topup-label-row">
                  <Label className="topup-section-label">Срок подписки</Label>
                </div>
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

          <div className="topup-meta-row">
            <Chip className="topup-fee-chip" color="default" size="sm" variant="soft">
              Комиссия 0%
            </Chip>
            <button className="topup-promo-link" type="button" onClick={() => setPromoModalOpen(true)}>
              Ввести промокод
              <ArrowRightIcon aria-hidden="true" className="ui-icon" />
            </button>
          </div>

          {status !== "idle" ? (
            <ProgressBar aria-label="Статус заказа" className="topup-order-progress" value={progress || 30}>
              <Label>{statusCopy[status]}</Label>
              <ProgressBar.Output />
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          ) : null}

          <div className="topup-payline">
            <Button
              fullWidth
              className="topup-cta"
              isPending={status !== "idle" && status !== "delivered"}
              size="lg"
              type="submit"
            >
              Оплатить {formatRub(total)}
              <span className="topup-cta-badge topup-cta-badge--inline font-digicoins">+{digicoinsEarned} Д</span>
            </Button>
            <span className="topup-cta-badge topup-cta-badge--floating font-digicoins">+{digicoinsEarned} Д</span>
          </div>
        </Form>
      </Surface>

      <Modal.Backdrop isOpen={promoModalOpen} onOpenChange={setPromoModalOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-[360px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Промокод</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <TextField fullWidth name="promoCode" value={promoCode} onChange={setPromoCode}>
                <Input className="topup-input" placeholder="Введите промокод" variant="secondary" />
              </TextField>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Отмена
              </Button>
              <Button slot="close">Применить</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
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

const shopDiscounts: Record<string, { originalPrice: number }> = {
  "steam-wallet": { originalPrice: 500 },
  "ps-plus": { originalPrice: 1990 },
  "vpn-pack": { originalPrice: 429 },
};

function TopProducts() {
  return (
    <section className="app-shell shop-section">
      <div className="shop-head">
        <Chip color="accent" size="sm" variant="soft">
          Топ товары
        </Chip>
        <Typography type="h2">Популярные товары</Typography>
        <Typography color="muted" type="body">Самые востребованные сервисы за последнюю неделю</Typography>
      </div>

      <div className="shop-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            href="#topup"
            id={product.id}
            name={product.name}
            originalPrice={shopDiscounts[product.id]?.originalPrice}
            priceFrom={product.priceFrom}
          />
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="app-shell section-gap" id="faq">
      <Typography align="center" type="h2">Частые вопросы</Typography>
      <Typography align="center" color="muted" type="body">
        Ответы на самые популярные вопросы о покупке и использовании товаров на Digimoll.
      </Typography>
      <Accordion className="mt-6 faq-accordion" variant="surface">
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
  const footerLinks = [
    { label: "Каталог", href: "/catalog" },
    { label: "Как купить", href: "#topup" },
    { label: "Доставка и оплата", href: "#topup" },
    { label: "Гарантии и возврат", href: "#topup" },
    { label: "FAQ", href: "#faq" },
  ];
  const socialLinks = [
    { label: "Telegram", icon: TelegramIcon, href: "#topup", primary: true },
    { label: "VK", asset: "/social/vk.svg", href: "#topup" },
    { label: "Discord", asset: "/social/discord.svg", href: "#topup" },
  ];
  const paymentLogos = [
    { label: "МИР", src: "/payments/mir.svg" },
    { label: "Visa", src: "/payments/visa.svg" },
    { label: "Mastercard", src: "/payments/mastercard.svg" },
    { label: "СБП", src: "/payments/sbp.svg" },
  ];

  return (
    <footer className="app-shell footer-section">
      <Surface className="footer-surface" variant="secondary">
        <div className="footer-top">
          <div className="footer-brand">
            <img alt="Digimoll" className="footer-logo" src="/fullLogo.svg" />
            <Chip className="footer-safe-badge" color="accent" variant="soft">
              <ShieldCheckIcon aria-hidden="true" className="ui-icon" />
              Безопасные покупки
            </Chip>
          </div>

          <nav className="footer-links" aria-label="Навигация">
            {footerLinks.map((item) => (
              <HeroLink key={item.label} href={item.href}>{item.label}</HeroLink>
            ))}
          </nav>

          <div className="footer-actions">
            <Button className="footer-support-button" variant="secondary">
              <TelegramIcon aria-hidden="true" className="ui-icon" />
              Поддержка 24/7
            </Button>
            <div className="footer-social-buttons">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    aria-label={item.label}
                    className="footer-social-button"
                    variant={item.primary ? "primary" : "secondary"}
                    onPress={() => (window.location.href = item.href)}
                  >
                    {Icon ? <Icon aria-hidden="true" className="ui-icon" /> : <img alt="" src={item.asset} />}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="footer-separator" />

        <div className="footer-bottom-row">
          <div className="footer-payments">
            <Typography color="muted" type="body-sm">Мы принимаем</Typography>
            <div>
              {paymentLogos.map((item) => (
                <span key={item.label} className="footer-payment-logo">
                  <img alt={item.label} src={item.src} />
                </span>
              ))}
            </div>
          </div>

          <div className="footer-legal">
            <Typography color="muted" type="body-sm">© 2026 Digimoll — Все права защищены</Typography>
            <Typography color="muted" type="body-sm">ИП Иванов И.И. · ИНН 123456789012 · hello@digimoll.ru</Typography>
          </div>
        </div>
      </Surface>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <QuickTopUp />
        <PromoCarousel />
        <TopProducts />
        <FAQ />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
