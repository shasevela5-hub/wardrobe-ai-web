import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { useWardrobeItems, useSavedOutfits, useWeather, usePreferences } from '../lib/hooks';
import { generateOutfitSuggestions, getWeatherRecommendation, getSeasonFromDate } from '../lib/outfitEngine';
import type { OutfitSuggestion } from '../lib/types';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { ItemDisplay } from '../components/ItemDisplay';
import { OCCASIONS } from '../lib/constants';

export function HomeScreen() {
  const { user } = useAuth();
  const { items } = useWardrobeItems(user?.id);
  const { saveOutfit } = useSavedOutfits(user?.id);
  const { prefs } = usePreferences(user?.id);
  const { weather, loading: weatherLoading, fetchWeather } = useWeather();

  const [occasion, setOccasion] = useState('casual');
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(40.7128, -74.006),
        { timeout: 5000 }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, [fetchWeather]);

  const season = useMemo(() => getSeasonFromDate(), []);
  const temp = weather?.temperature ?? 20;

  const suggestionsMemo = useMemo(() => {
    return generateOutfitSuggestions(items, {
      occasion,
      season,
      temp,
      preferences: prefs ? { favColors: prefs.favorite_colors, avoidColors: prefs.avoid_colors } : undefined,
    }, 3);
  }, [items, occasion, season, temp, prefs]);

  useEffect(() => {
    setSuggestions(suggestionsMemo);
    setCurrentIndex(0);
    setSaved(false);
  }, [suggestionsMemo]);

  const current = suggestions[currentIndex];
  const weatherRec = weather ? getWeatherRecommendation(weather) : null;

  const handleSave = async () => {
    if (!current || !user) return;
    setSaving(true);
    try {
      await saveOutfit({
        name: current.title,
        top_id: current.top?.id ?? null,
        bottom_id: current.bottom?.id ?? null,
        outerwear_id: current.outerwear?.id ?? null,
        footwear_id: current.footwear?.id ?? null,
        accessory_id: current.accessory?.id ?? null,
        occasion,
        weather_temp_min: temp - 3,
        weather_temp_max: temp + 3,
        notes: current.stylingTips,
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const weatherIcon = weather?.condition.includes('clear') ? 'Sun'
    : weather?.condition.includes('rain') ? 'CloudRain'
    : weather?.condition.includes('snow') ? 'CloudSnow'
    : 'Cloud';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">Today's Look</h1>
        <p className="text-earth-500 mt-1">AI-curated outfit suggestions just for you</p>
      </div>

      {weather && (
        <div className="card p-5 mb-6 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-50 flex items-center justify-center">
              <Icon name={weatherIcon} size={28} className="text-gold-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-earth-900">{weather.temperature}°C</span>
                <span className="text-earth-400 text-sm">Feels like {weather.feelsLike}°</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <Icon name="MapPin" size={12} />
                <span>{weather.location}</span>
                <span className="capitalize">• {weather.description}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-earth-400">
            <div className="flex items-center gap-1.5">
              <Icon name="Droplets" size={16} />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Wind" size={16} />
              <span className="text-sm">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}

      {weatherLoading && !weather && (
        <div className="card p-5 mb-6 flex items-center gap-3 text-earth-400">
          <Icon name="Loader2" size={20} className="animate-spin" />
          <span>Loading weather...</span>
        </div>
      )}

      {weatherRec && (
        <div className="bg-gold-50 border border-gold-100 rounded-2xl p-4 mb-6 text-sm text-gold-800 animate-slide-up">
          <span className="font-medium">Weather tip: </span>{weatherRec.recommendation}
        </div>
      )}

      <div className="mb-6">
        <label className="label">Occasion</label>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => { setOccasion(o); setSaved(false); }}
              className={`badge px-4 py-2 text-sm font-medium capitalize transition-all ${occasion === o ? 'bg-gold-400 text-earth-900' : 'bg-white text-earth-500 border border-earth-200 hover:border-earth-300'}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-earth-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="Shirt" size={32} className="text-earth-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">Your wardrobe is empty</h3>
          <p className="text-earth-500 text-sm">Add clothing items to get personalized outfit suggestions.</p>
        </div>
      ) : current ? (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-earth-900">{current.title}</h2>
                <p className="text-earth-500 text-sm mt-1">{current.description}</p>
              </div>
              <div className="flex gap-1">
                {suggestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentIndex(i); setSaved(false); }}
                    className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-gold-400' : 'w-2 bg-earth-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {current.outerwear && <ItemDisplay label="Outerwear" item={current.outerwear} />}
              {current.top && <ItemDisplay label="Top" item={current.top} />}
              {current.bottom && <ItemDisplay label="Bottom" item={current.bottom} />}
              {current.footwear && <ItemDisplay label="Footwear" item={current.footwear} />}
              {current.accessory && <ItemDisplay label="Accessory" item={current.accessory} />}
            </div>

            <div className="bg-earth-50 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Sparkles" size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-earth-900 text-sm mb-1">Styling Tips</h4>
                  <p className="text-sm text-earth-600">{current.stylingTips}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={saved ? 'Check' : 'Save'}
                variant={saved ? 'secondary' : 'primary'}
                onClick={handleSave}
                loading={saving}
                disabled={saved}
              >
                {saved ? 'Saved!' : 'Save Outfit'}
              </Button>
              <Button
                variant="secondary"
                icon="RefreshCw"
                onClick={() => { setCurrentIndex((prev) => (prev + 1) % suggestions.length); setSaved(false); }}
              >
                Next Suggestion
              </Button>
              {!current.top && !current.bottom && (
                <span className="text-sm text-earth-400 self-center ml-2">Add more items for better suggestions</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Icon name="Sparkles" size={32} className="text-earth-300 mx-auto mb-4" />
          <p className="text-earth-500">No suggestions available. Try a different occasion.</p>
        </div>
      )}
    </div>
  );
}
