"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Description,
  Link as HeroLink,
  Separator,
  Surface,
  Switch,
  Table,
  Typography,
} from "@heroui/react";
import { orders, subscriptions } from "@/lib/mock-data";
import { MobileNav } from "@/components/MobileNav";

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function AccountHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="app-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <HeroLink href="/">
          <img alt="Digimoll" className="h-9 w-auto" src="/fullLogo.svg" />
        </HeroLink>
        <div className="flex items-center gap-3">
          <Button onPress={() => (window.location.href = "/")} variant="secondary">
            На главную
          </Button>
          <Button>Пополнить баланс</Button>
        </div>
      </div>
    </header>
  );
}

function BalanceCard() {
  return (
    <Surface className="rounded-2xl border border-border p-6 md:p-8" variant="secondary">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Chip color="warning" variant="soft">DigiCoins</Chip>
          <Typography className="mt-4" type="h1">1 240</Typography>
          <Typography color="muted" type="body">
            Используйте бонусы для сниженной комиссии, быстрых операций и повторных покупок.
          </Typography>
        </div>
        <Button size="lg">Пополнить баланс</Button>
      </div>
    </Surface>
  );
}

function SubscriptionList() {
  const [items, setItems] = useState(subscriptions);

  const toggle = (id: string, nextValue: boolean) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, autoRenew: nextValue } : item)),
    );
  };

  return (
    <section className="section-gap">
      <Typography type="h3">Активные подписки</Typography>
      <Typography color="muted" type="body-sm">
        Управляйте автопродлением и контролируйте даты следующих платежей.
      </Typography>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} variant="tertiary">
            <Card.Header>
              <Card.Title>{item.name}</Card.Title>
              <Card.Description>Следующее продление: {item.nextDate}</Card.Description>
            </Card.Header>
            <Card.Content>
              <Typography type="h4">{formatRub(item.price)}</Typography>
            </Card.Content>
            <Card.Footer>
              <Switch isSelected={item.autoRenew} onChange={(next) => toggle(item.id, next)}>
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  Автопродление
                </Switch.Content>
                <Description>
                  {item.autoRenew ? "Включено, напомним заранее" : "Отключено для этой подписки"}
                </Description>
              </Switch>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </section>
  );
}

function OrderHistory() {
  return (
    <section className="section-gap">
      <Surface className="rounded-2xl border border-border p-5 md:p-7" variant="secondary">
        <Typography type="h3">История заказов</Typography>
        <Typography color="muted" type="body-sm">Последние покупки и статусы выдачи.</Typography>
        <div className="mt-5">
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="История заказов Digimoll" className="min-w-[680px]">
                <Table.Header>
                  <Table.Column isRowHeader>Заказ</Table.Column>
                  <Table.Column>Сервис</Table.Column>
                  <Table.Column>Дата</Table.Column>
                  <Table.Column>Сумма</Table.Column>
                  <Table.Column>Статус</Table.Column>
                </Table.Header>
                <Table.Body>
                  {orders.map((order) => (
                    <Table.Row key={order.id} id={order.id}>
                      <Table.Cell>{order.id}</Table.Cell>
                      <Table.Cell>{order.service}</Table.Cell>
                      <Table.Cell>{order.date}</Table.Cell>
                      <Table.Cell>{formatRub(order.amount)}</Table.Cell>
                      <Table.Cell>
                        <Chip color="success" variant="soft">{order.status}</Chip>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </Surface>
    </section>
  );
}

function ReferralCard() {
  return (
    <section className="section-gap pb-10">
      <Card variant="tertiary">
        <Card.Header>
          <Chip color="accent" variant="soft">Реферальная программа</Chip>
          <Card.Title>Приглашайте друзей и получайте DigiCoins</Card.Title>
          <Card.Description>
            Дайте ссылку другу: после первой покупки бонус появится на вашем балансе.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Surface className="rounded-xl border border-border p-4" variant="secondary">
            <Typography type="code">digimoll.ru/invite/kirill</Typography>
          </Surface>
        </Card.Content>
        <Card.Footer className="flex flex-wrap gap-3">
          <Button>Скопировать ссылку</Button>
          <Button variant="outline">Открыть условия</Button>
        </Card.Footer>
      </Card>
    </section>
  );
}

export default function AccountPage() {
  return (
    <>
      <AccountHeader />
      <main className="app-shell section-gap">
        <div className="grid gap-2">
          <Typography type="h2">Личный кабинет</Typography>
          <Typography color="muted" type="body">
            Баланс, подписки, история заказов и повторные покупки в одном месте.
          </Typography>
        </div>
        <Separator className="my-6" />
        <BalanceCard />
        <SubscriptionList />
        <OrderHistory />
        <ReferralCard />
      </main>
      <MobileNav />
    </>
  );
}
