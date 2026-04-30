import type { Metadata } from 'next';
import '../styles/tailwind.css';

export const metadata: Metadata = {
  title: 'UnivData',
  description: 'UnivData Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}
        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fmoses121237948back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
