import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "ScamRadar — Проверка проектов на мошенничество",
  description: "Проверь проект до того, как потеряешь деньги",
  keywords: ["мошенничество", "scam", "проверка", "пирамида", "FOMO"],
  openGraph: {
    title: "ScamRadar",
    description: "Проверь проект до того, как потеряешь деньги",
    url: "https://scamradar-chi.vercel.app",
    siteName: "ScamRadar",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
