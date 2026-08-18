import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { usePreferences } from '../lib/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import {
  STYLE_PREFERENCES, BODY_TYPES, SIZES, WEATHER_SENSITIVITY, COLORS,
} from '../lib/constants';

export function PreferencesScreen() {
  const { user, signOut } = useAuth();
  const { prefs, loading, savePreferences } = usePreferences(user?.id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [styles, setStyles] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState('');
  const [favColors, setFavColors] = useState<string[]>([]);
  const [avoidColors, setAvoidColors] = useState<string[]>([]);
  const [topSize, setTopSize] = useState('');
  const [bottomSize, setBottomSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [weatherSens, setWeatherSens] = useState('neutral');

  useEffect(() => {
    if (prefs) {
      setStyles(prefs.style_preferences || []);
      setBodyType(prefs.body_type || '');
      setFavColors(prefs.favorite_colors || []);
      setAvoidColors(prefs.avoid_colors || []);
      setTopSize(prefs.top_size || '');
      setBottomSize(prefs.bottom_size || '');
      setShoeSize(prefs.shoe_size || '');
      setWeatherSens(prefs.weather_sensitivity || 'neutral');
    }
  }, [prefs]);

  const toggleStyle = (style: string) => {
    setStyles((prev) => prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]);
  };

  const toggleColor = (hex: string, list: 'fav' | 'avoid') => {
    const setter = list === 'fav' ? setFavColors : setAvoidColors;
    const current = list === 'fav' ? favColors : avoidColors;
    setter(current.includes(hex) ? current.filter((c) => c !== hex) : [...current, hex]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await savePreferences({
        style_preferences: styles,
        body_type: bodyType || null,
        favorite_colors: favColors,
        avoid_colors: avoidColors,
        top_size: topSize || null,
        bottom_size: bottomSize || null,
        shoe_size: shoeSize || null,
        weather_sensitivity: weatherSens,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={28} className="animate-spin text-earth-300" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">Preferences</h1>
        <p className="text-earth-500 mt-1">Help your AI stylist understand your taste</p>
      </div>

      <div className="space-y-6">
        <Section title="Style Preferences" subtitle="Select all that match your taste">
          <div className="flex flex-wrap gap-2">
            {STYLE_PREFERENCES.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`badge px-4 py-2.5 text-sm font-medium capitalize transition-all ${styles.includes(style) ? 'bg-gold-400 text-earth-900' : 'bg-white text-earth-500 border border-earth-200 hover:border-earth-300'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Body Type" subtitle="For better fit recommendations">
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setBodyType(type)}
                className={`badge px-4 py-2.5 text-sm font-medium capitalize transition-all ${bodyType === type ? 'bg-gold-400 text-earth-900' : 'bg-white text-earth-500 border border-earth-200 hover:border-earth-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Favorite Colors" subtitle="Colors you love wearing">
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => toggleColor(c.hex, 'fav')}
                className={`relative h-10 rounded-lg border-2 transition-all ${favColors.includes(c.hex) ? 'border-gold-400 scale-110' : 'border-earth-100'} ${avoidColors.includes(c.hex) ? 'opacity-30' : ''}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {favColors.includes(c.hex) && <Icon name="Check" size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Colors to Avoid" subtitle="Colors you prefer not to wear">
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => toggleColor(c.hex, 'avoid')}
                className={`relative h-10 rounded-lg border-2 transition-all ${avoidColors.includes(c.hex) ? 'border-red-400 scale-110' : 'border-earth-100'} ${favColors.includes(c.hex) ? 'opacity-30' : ''}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {avoidColors.includes(c.hex) && <Icon name="X" size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Sizes" subtitle="Your clothing sizes">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Top</label>
              <select className="input" value={topSize} onChange={(e) => setTopSize(e.target.value)}>
                <option value="">—</option>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Bottom</label>
              <select className="input" value={bottomSize} onChange={(e) => setBottomSize(e.target.value)}>
                <option value="">—</option>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Shoe</label>
              <input className="input" value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} placeholder="e.g. 9" />
            </div>
          </div>
        </Section>

        <Section title="Weather Sensitivity" subtitle="How you handle temperature">
          <div className="space-y-2">
            {WEATHER_SENSITIVITY.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWeatherSens(opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${weatherSens === opt.value ? 'border-gold-400 bg-gold-50 text-gold-800' : 'border-earth-200 text-earth-600 hover:border-earth-300'}`}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-4">
          <Button icon={saved ? 'Check' : 'Save'} onClick={handleSave} loading={saving} disabled={saved}>
            {saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </div>

        <div className="border-t border-earth-100 pt-6 mt-6">
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-earth-500 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <Icon name="LogOut" size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card p-6 animate-slide-up">
      <div className="mb-4">
        <h2 className="font-serif text-lg font-bold text-earth-900">{title}</h2>
        <p className="text-sm text-earth-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
