import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digimoll",
  description: "Платформа для оплаты зарубежных цифровых сервисов из России",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" data-theme="dark" lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
