import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <p className="font-mono text-sm text-muted-foreground mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Page introuvable
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-card hover:shadow-card-hover transition-shadow"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
