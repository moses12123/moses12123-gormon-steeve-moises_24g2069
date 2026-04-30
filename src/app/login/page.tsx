'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a73e8] flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1a73e8]" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">UnivData Analytics</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Analyse vos données<br />universitaires
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
              Tableau de bord professionnel pour suivre, analyser et optimiser les performances académiques en temps réel.
            </p>
          </div>
        </div>
        {/* Decorative stats cards */}
        <div className="relative z-10 space-y-3">
          {[
            { label: 'Étudiants actifs', value: '12,847', change: '+8.2%' },
            { label: 'Taux de réussite', value: '94.3%', change: '+2.1%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/20">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-white text-xl font-bold mt-0.5">{stat.value}</p>
              </div>
              <span className="bg-green-400/20 text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-400/30">
                {stat.change}
              </span>
            </div>
          ))}
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900">UnivData</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
            <p className="text-gray-500 mt-1 text-sm">Accédez à votre tableau de bord analytique</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all bg-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-[#1a73e8] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#1a73e8] font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="underline">Conditions d&apos;utilisation</a>
            {' '}et notre{' '}
            <a href="#" className="underline">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
}
