export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full">
        <div className="rounded-2xl border border-border bg-card shadow-card p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              U
            </span>
            <span className="text-sm font-mono text-muted-foreground tracking-wide">
              UNIVDATA
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Bienvenue sur UnivData
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Plateforme de données universitaires. L&apos;application est en cours
            de configuration.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--sciences))' }}
                />
                <h2 className="font-semibold">Sciences</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Filières scientifiques et techniques.
              </p>
            </div>

            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--lettres))' }}
                />
                <h2 className="font-semibold">Lettres</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Filières littéraires et sciences humaines.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
            Modifiez{' '}
            <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
              src/app/page.tsx
            </code>{' '}
            pour personnaliser cette page.
          </div>
        </div>
      </div>
    </main>
  );
}
