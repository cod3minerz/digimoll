import type { Metadata, Viewport } from "next";
import "./globals.css";

const ROBOTO_FLEX_HREF =
  "https://fonts.googleapis.com/css2?family=Roboto+Flex:GRAD,opsz,slnt,wdth,wght,XOPQ,XTRA,YOPQ,YTAS,YTFI,YTLC,YTUC@-200..150,8..144,-10..0,25..151,100..1000,27..175,323..603,25..135,649..854,560..788,416..570,528..760&display=swap";

export const metadata: Metadata = {
  title: "Digimoll",
  description: "Платформа для оплаты зарубежных цифровых сервисов из России",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" data-theme="dark" lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={ROBOTO_FLEX_HREF} />
      </head>
      <body>{children}</body>
    </html>
  );
}
