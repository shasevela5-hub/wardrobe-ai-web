import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WardrobeScreen } from './screens/WardrobeScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { PreferencesScreen } from './screens/PreferencesScreen';
import { StylistChatScreen } from './screens/StylistChatScreen';
import { Icon } from './components/Icon';

type Tab = 'home' | 'wardrobe' | 'favorites' | 'stylist' | 'preferences';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'wardrobe', label: 'Wardrobe', icon: 'Shirt' },
  { id: 'favorites', label: 'Saved', icon: 'Heart' },
  { id: 'stylist', label: 'Stylist', icon: 'Sparkles' },
  { id: 'preferences', label: 'Profile', icon: 'Settings' },
];

function AppContent() {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400 mb-4 animate-pulse">
            <Icon name="Sparkles" size={32} className="text-earth-900" />
          </div>
          <p className="text-earth-400 text-sm">Loading Wardrobe AI...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-earth-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-400 flex items-center justify-center">
              <Icon name="Sparkles" size={18} className="text-earth-900" />
            </div>
            <span className="font-serif text-lg font-bold text-earth-900 hidden sm:block">Wardrobe AI</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t.id ? 'bg-gold-400 text-earth-900' : 'text-earth-500 hover:bg-earth-50'}`}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="sm:hidden">
            <span className="text-sm font-medium text-earth-500 capitalize">{TABS.find((t) => t.id === tab)?.label}</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {tab === 'home' && <HomeScreen />}
        {tab === 'wardrobe' && <WardrobeScreen />}
        {tab === 'favorites' && <FavoritesScreen />}
        {tab === 'stylist' && <StylistChatScreen />}
        {tab === 'preferences' && <PreferencesScreen />}
      </main>

      <nav className="sm:hidden sticky bottom-0 z-40 bg-white/90 backdrop-blur-lg border-t border-earth-100">
        <div className="flex items-center justify-around h-16">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-all ${tab === t.id ? 'text-gold-600' : 'text-earth-400'}`}
            >
              <Icon name={t.icon} size={20} strokeWidth={tab === t.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
