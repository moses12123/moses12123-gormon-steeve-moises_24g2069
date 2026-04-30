'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, { fullName });
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
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
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">UnivData Analytics</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Rejoignez des milliers<br />d&apos;établissements
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
              Créez votre compte et commencez à analyser vos données universitaires dès aujourd&apos;hui.
            </p>
          </div>
        </div>
        <div className="relative z-10 space-y-3">
          {[
            { icon: '📊', text: 'Tableaux de bord en temps réel' },
            { icon: '🎓', text: 'Suivi des performances académiques' },
            { icon: '🔒', text: 'Données sécurisées et confidentielles' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20">
              <span className="text-xl">{item.icon}</span>
              <span className="text-white text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900">UnivData</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Créer un compte</h2>
            <p className="text-gray-500 mt-1 text-sm">Commencez gratuitement, sans carte bancaire</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Jean Dupont"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 6 caractères"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Création en cours...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#1a73e8] font-medium hover:underline">
              Se connecter
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="underline">Conditions d&apos;utilisation</a>
            {' '}et notre{' '}
            <a href="#" className="underline">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
}
