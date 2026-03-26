import "./globals.css";

export const metadata = {
  title: "ScamRadar",
  description: "Проверь проект до того, как потеряешь деньги",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
