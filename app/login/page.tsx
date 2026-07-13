"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Label,
  Link as HeroLink,
  Separator,
  Surface,
  TextField,
  Typography,
} from "@heroui/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(next);
  };

  return (
    <main className="auth-page">
      <Surface className="auth-card" variant="secondary">
        <HeroLink className="auth-logo" href="/">
          <img alt="Digimoll" className="h-9 w-auto" src="/fullLogo.svg" />
        </HeroLink>

        <div className="auth-heading">
          <Typography type="h2">{isRegister ? "Регистрация" : "Вход в аккаунт"}</Typography>
          <Typography color="muted" type="body-sm">
            {isRegister
              ? "Создайте аккаунт Digimoll, чтобы копить DigiCoins и следить за заказами."
              : "Войдите, чтобы управлять балансом, подписками и историей заказов."}
          </Typography>
        </div>

        <Form className="auth-form" onSubmit={submit}>
          <TextField isRequired fullWidth name="login" value={login} onChange={setLogin}>
            <Label className="topup-section-label">Email или логин</Label>
            <Input className="topup-input" placeholder="you@example.com" variant="secondary" />
          </TextField>

          <TextField isRequired fullWidth name="password" type="password" value={password} onChange={setPassword}>
            <Label className="topup-section-label">Пароль</Label>
            <Input className="topup-input" placeholder="••••••••" variant="secondary" />
          </TextField>

          {isRegister ? (
            <TextField isRequired fullWidth name="confirmPassword" type="password">
              <Label className="topup-section-label">Повторите пароль</Label>
              <Input className="topup-input" placeholder="••••••••" variant="secondary" />
            </TextField>
          ) : null}

          <Button fullWidth className="auth-submit" size="lg" type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </Button>
        </Form>

        <Separator className="auth-separator" />

        <Typography align="center" color="muted" type="body-sm">
          {isRegister ? (
            <>
              Уже есть аккаунт?{" "}
              <button className="auth-switch" type="button" onClick={() => setMode("login")}>
                Войти
              </button>
            </>
          ) : (
            <>
              Нет аккаунта?{" "}
              <button className="auth-switch" type="button" onClick={() => setMode("register")}>
                Зарегистрируйтесь
              </button>
            </>
          )}
        </Typography>
      </Surface>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
