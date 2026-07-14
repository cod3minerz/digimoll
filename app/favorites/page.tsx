"use client";

import { useEffect, useState } from "react";
import { Button, Surface, Typography } from "@heroui/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { MobileNav } from "@/components/MobileNav";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AuthGate } from "@/components/AuthGate";
import { isLoggedIn } from "@/lib/mock-auth";

function FavoritesEmptyState() {
  return (
    <div className="auth-gate">
      <Surface className="auth-gate-card" variant="secondary">
        <span aria-hidden="true" className="auth-gate-icon">
          <HeartIcon className="ui-icon" />
        </span>
        <Typography type="h3">Пока пусто</Typography>
        <Typography color="muted" type="body-sm">
          Добавляйте товары в избранное на карточках каталога, чтобы быстро возвращаться к ним.
        </Typography>
        <Button fullWidth className="auth-gate-submit" size="lg" onPress={() => (window.location.href = "/#categories")}>
          В каталог
        </Button>
      </Surface>
    </div>
  );
}

export default function FavoritesPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isLoggedIn());
  }, []);

  return (
    <>
      <SimpleHeader>
        <Button onPress={() => (window.location.href = "/")} variant="secondary">
          На главную
        </Button>
      </SimpleHeader>
      <main className="app-shell section-gap">
        <div className="grid gap-2">
          <Typography type="h2">Избранное</Typography>
          <Typography color="muted" type="body">
            Товары, которые вы отметили сердечком, будут появляться здесь.
          </Typography>
        </div>
        {authed === null ? null : authed ? (
          <FavoritesEmptyState />
        ) : (
          <AuthGate
            description="Войдите в аккаунт Digimoll, чтобы сохранять товары в избранное."
            next="/favorites"
            title="Нужно войти"
          />
        )}
      </main>
      <MobileNav />
    </>
  );
}
