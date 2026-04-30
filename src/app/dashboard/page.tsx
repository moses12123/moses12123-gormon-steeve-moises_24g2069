'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const areaData = [
  { month: 'Jan', étudiants: 8200, inscrits: 7800 },
  { month: 'Fév', étudiants: 8900, inscrits: 8400 },
  { month: 'Mar', étudiants: 9400, inscrits: 8900 },
  { month: 'Avr', étudiants: 9100, inscrits: 8700 },
  { month: 'Mai', étudiants: 10200, inscrits: 9600 },
  { month: 'Jun', étudiants: 11000, inscrits: 10400 },
  { month: 'Jul', étudiants: 10600, inscrits: 10100 },
  { month: 'Aoû', étudiants: 11400, inscrits: 10800 },
  { month: 'Sep', étudiants: 12100, inscrits: 11500 },
  { month: 'Oct', étudiants: 12500, inscrits: 11900 },
  { month: 'Nov', étudiants: 12847, inscrits: 12200 },
];

const barData = [
  { filière: 'Sciences', taux: 96 },
  { filière: 'Lettres', taux: 91 },
  { filière: 'Droit', taux: 88 },
  { filière: 'Médecine', taux: 94 },
  { filière: 'Économie', taux: 89 },
  { filière: 'Ingénierie', taux: 97 },
];

const kpis = [
  { label: 'Étudiants actifs', value: '12,847', change: '+8.2%', up: true, icon: '👥' },
  { label: 'Taux de réussite', value: '94.3%', change: '+2.1%', up: true, icon: '🎓' },
  { label: 'Nouvelles inscriptions', value: '1,284', change: '+12.5%', up: true, icon: '📝' },
  { label: 'Taux d\'abandon', value: '3.2%', change: '-0.8%', up: false, icon: '📉' },
];

const navItems = [
  { label: 'Vue d\'ensemble', icon: '📊', href: '/dashboard', active: true },
  { label: 'Étudiants', icon: '👥', href: '/dashboard/students' },
  { label: 'Filières', icon: '🎓', href: '/dashboard/programs' },
  { label: 'Performances', icon: '📈', href: '/dashboard/performance' },
  { label: 'Rapports', icon: '📋', href: '/dashboard/reports' },
  { label: 'Paramètres', icon: '⚙️', href: '/dashboard/settings' },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#1a73e8]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userInitial = user?.email?.[0]?.toUpperCase() ?? 'U';
  const userEmail = user?.email ?? '';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="w-7 h-7 bg-[#1a73e8] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">UnivData</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Principal</p>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { router.push(item.href); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-[#e8f0fe] text-[#1a73e8]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
            <div className="w-7 h-7 bg-[#1a73e8] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{userEmail}</p>
              <p className="text-[10px] text-gray-400">Administrateur</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              title="Déconnexion"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Vue d&apos;ensemble</h1>
              <p className="text-xs text-gray-400">Données en temps réel · Mis à jour il y a 2 min</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Janv – Nov 2024
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {signingOut ? 'Déconnexion...' : 'Déconnexion'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl">{kpi.icon}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      kpi.up
                        ? 'bg-green-50 text-green-600' :'bg-red-50 text-red-600'
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Area chart */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Évolution des effectifs</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Étudiants actifs vs inscrits</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
                    Actifs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]" />
                    Inscrits
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEtudiants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInscrits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34a853" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#34a853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Area type="monotone" dataKey="étudiants" stroke="#1a73e8" strokeWidth={2} fill="url(#colorEtudiants)" dot={false} />
                  <Area type="monotone" dataKey="inscrits" stroke="#34a853" strokeWidth={2} fill="url(#colorInscrits)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900">Taux de réussite par filière</h3>
                <p className="text-xs text-gray-400 mt-0.5">Année académique 2024</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal vertical={false} />
                  <XAxis dataKey="filière" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    formatter={(v: any) => [`${v}%`, 'Taux']}
                  />
                  <Bar dataKey="taux" fill="#1a73e8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Nouvelle inscription', detail: 'Marie Dubois — Sciences', time: 'Il y a 5 min', color: 'bg-blue-100 text-blue-600' },
                  { action: 'Rapport généré', detail: 'Performances T3 2024', time: 'Il y a 23 min', color: 'bg-green-100 text-green-600' },
                  { action: 'Mise à jour données', detail: 'Filière Médecine', time: 'Il y a 1h', color: 'bg-orange-100 text-orange-600' },
                  { action: 'Nouvel utilisateur', detail: 'Prof. Martin — Admin', time: 'Il y a 2h', color: 'bg-purple-100 text-purple-600' },
                  { action: 'Export CSV', detail: 'Liste étudiants Droit', time: 'Il y a 3h', color: 'bg-gray-100 text-gray-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${item.color} flex-shrink-0`}>
                      {item.action}
                    </span>
                    <span className="text-xs text-gray-600 flex-1 truncate">{item.detail}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top programs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Filières les plus demandées</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sciences & Technologies', students: 3240, pct: 92 },
                  { name: 'Médecine & Santé', students: 2180, pct: 78 },
                  { name: 'Droit & Sciences Politiques', students: 1960, pct: 70 },
                  { name: 'Économie & Gestion', students: 1740, pct: 62 },
                  { name: 'Lettres & Humanités', students: 1420, pct: 51 },
                ].map((prog, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{prog.name}</span>
                      <span className="text-xs text-gray-500">{prog.students.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1a73e8] rounded-full transition-all duration-500"
                        style={{ width: `${prog.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
