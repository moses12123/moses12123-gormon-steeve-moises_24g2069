'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/components/GoogleAnalytics';

interface ProfileForm {
  fullName: string;
  email: string;
  role: string;
  institution: string;
  phone: string;
}

interface PreferencesForm {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  weeklyReport: boolean;
  alertsEnabled: boolean;
  dashboardDensity: string;
}

const navItems = [
  { label: 'Vue d\'ensemble', icon: '📊', href: '/dashboard' },
  { label: 'Étudiants', icon: '👥', href: '/dashboard/students' },
  { label: 'Filières', icon: '🎓', href: '/dashboard/programs' },
  { label: 'Performances', icon: '📈', href: '/dashboard/performance' },
  { label: 'Rapports', icon: '📋', href: '/dashboard/reports' },
  { label: 'Paramètres', icon: '⚙️', href: '/dashboard/settings', active: true },
];

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>({
    fullName: '',
    email: '',
    role: 'Administrateur',
    institution: 'Université',
    phone: '',
  });

  const [preferences, setPreferences] = useState<PreferencesForm>({
    language: 'fr',
    timezone: 'Europe/Paris',
    emailNotifications: true,
    weeklyReport: true,
    alertsEnabled: true,
    dashboardDensity: 'comfortable',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (user) {
      setProfile((prev) => ({
        ...prev,
        email: user.email ?? '',
        fullName: user.user_metadata?.full_name ?? '',
      }));
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch {
      setSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: profile.fullName },
      });
      trackEvent('settings_profile_saved', { user_id: user?.id });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    trackEvent('settings_preferences_saved', { language: preferences.language });
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (error) throw error;
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      trackEvent('settings_password_changed');
    } catch (err: any) {
      setPasswordError(err.message ?? 'Erreur lors du changement de mot de passe.');
    } finally {
      setSaving(false);
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

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'preferences', label: 'Préférences', icon: '🎨' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="w-7 h-7 bg-[#1a73e8] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">UnivData</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Principal</p>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { router.push(item.href); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Paramètres</h1>
              <p className="text-xs text-gray-400">Gérez votre profil et vos préférences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sauvegardé
              </span>
            )}
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

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* User card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1a73e8] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile.fullName || userEmail}
                </p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
                  ✓ Administrateur
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-[#1a73e8] text-[#1a73e8] bg-[#f8fbff]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom complet</label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          placeholder="Votre nom complet"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Rôle</label>
                        <select
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors bg-white"
                        >
                          <option>Administrateur</option>
                          <option>Directeur</option>
                          <option>Enseignant</option>
                          <option>Analyste</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Institution</label>
                        <input
                          type="text"
                          value={profile.institution}
                          onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                          placeholder="Nom de l'université"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+33 6 00 00 00 00"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#1a73e8] text-white text-sm font-medium rounded-lg hover:bg-[#1557b0] transition-colors disabled:opacity-60"
                      >
                        {saving ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : null}
                        {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Langue</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] bg-white transition-colors"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Fuseau horaire</label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] bg-white transition-colors"
                        >
                          <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                          <option value="Africa/Casablanca">Africa/Casablanca (UTC+1)</option>
                          <option value="Africa/Tunis">Africa/Tunis (UTC+1)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Densité du tableau de bord</label>
                        <div className="flex gap-3">
                          {['compact', 'comfortable', 'spacious'].map((d) => (
                            <button
                              key={d}
                              onClick={() => setPreferences({ ...preferences, dashboardDensity: d })}
                              className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                                preferences.dashboardDensity === d
                                  ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8]'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {d === 'compact' ? 'Compact' : d === 'comfortable' ? 'Confortable' : 'Spacieux'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSavePreferences}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#1a73e8] text-white text-sm font-medium rounded-lg hover:bg-[#1557b0] transition-colors disabled:opacity-60"
                      >
                        {saving ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : null}
                        {saving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                      <div className="space-y-3 max-w-sm">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="Minimum 8 caractères"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            placeholder="Répétez le nouveau mot de passe"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-colors"
                          />
                        </div>
                        {passwordError && (
                          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>
                        )}
                        {passwordSuccess && (
                          <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            ✓ Mot de passe mis à jour avec succès.
                          </p>
                        )}
                        <button
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="flex items-center gap-2 px-5 py-2 bg-[#1a73e8] text-white text-sm font-medium rounded-lg hover:bg-[#1557b0] transition-colors disabled:opacity-60"
                        >
                          {saving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Sessions actives</h3>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-[#e8f0fe] rounded-lg flex items-center justify-center text-sm">💻</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Session actuelle</p>
                          <p className="text-[10px] text-gray-400">Navigateur web · Connecté maintenant</p>
                        </div>
                        <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Actif</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 mb-4">Configurez les alertes et rapports automatiques.</p>
                    {[
                      { key: 'emailNotifications', label: 'Notifications par e-mail', desc: 'Recevoir des alertes importantes par e-mail' },
                      { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé automatique chaque lundi matin' },
                      { key: 'alertsEnabled', label: 'Alertes en temps réel', desc: 'Notifications pour les événements critiques' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            setPreferences({
                              ...preferences,
                              [item.key]: !preferences[item.key as keyof PreferencesForm],
                            })
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                            preferences[item.key as keyof PreferencesForm] ? 'bg-[#1a73e8]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              preferences[item.key as keyof PreferencesForm] ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSavePreferences}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#1a73e8] text-white text-sm font-medium rounded-lg hover:bg-[#1557b0] transition-colors disabled:opacity-60"
                      >
                        {saving ? 'Sauvegarde...' : 'Sauvegarder les notifications'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
