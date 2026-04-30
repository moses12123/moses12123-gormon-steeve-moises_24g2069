import type { Metadata } from 'next';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: 'UnivData Analytics',
  description: 'Tableau de bord analytique universitaire professionnel',
import './globals.css';

export const metadata: Metadata = {
  title: 'UnivData',
  description: 'Plateforme de données universitaires',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fmoses121237948back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          {children}
        </AuthProvider>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
