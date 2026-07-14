"use client";

import { Button, Surface, Typography } from "@heroui/react";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export function AuthGate({
  title,
  description,
  next,
}: {
  title: string;
  description: string;
  next: string;
}) {
  return (
    <div className="auth-gate">
      <Surface className="auth-gate-card" variant="secondary">
        <span aria-hidden="true" className="auth-gate-icon">
          <LockClosedIcon className="ui-icon" />
        </span>
        <Typography type="h3">{title}</Typography>
        <Typography color="muted" type="body-sm">
          {description}
        </Typography>
        <Button
          fullWidth
          className="auth-gate-submit"
          size="lg"
          onPress={() => (window.location.href = `/login?next=${encodeURIComponent(next)}`)}
        >
          Войти
        </Button>
      </Surface>
    </div>
  );
}
