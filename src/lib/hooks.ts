import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { WardrobeItem, SavedOutfit, UserPreferences, StylistChat } from './types';

export function useWardrobeItems(userId: string | undefined) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else { setItems(data || []); setError(null); }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addItem = useCallback(async (item: Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'times_worn'>) => {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    setItems((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<WardrobeItem>) => {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
    return data;
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('wardrobe_items').delete().eq('id', id);
    if (error) throw error;
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const incrementWorn = useCallback(async (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const newCount = item.times_worn + 1;
    const { error } = await supabase
      .from('wardrobe_items')
      .update({ times_worn: newCount })
      .eq('id', id);
    if (error) throw error;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, times_worn: newCount } : it)));
  }, [items]);

  return { items, loading, error, addItem, updateItem, deleteItem, incrementWorn, refetch: fetch };
}

export function useSavedOutfits(userId: string | undefined) {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('saved_outfits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setOutfits(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const saveOutfit = useCallback(async (outfit: {
    name: string;
    top_id: string | null;
    bottom_id: string | null;
    outerwear_id: string | null;
    footwear_id: string | null;
    accessory_id: string | null;
    occasion: string;
    weather_temp_min: number | null;
    weather_temp_max: number | null;
    notes: string | null;
  }) => {
    const { data, error } = await supabase
      .from('saved_outfits')
      .insert(outfit)
      .select()
      .single();
    if (error) throw error;
    setOutfits((prev) => [data, ...prev]);
    return data;
  }, []);

  const deleteOutfit = useCallback(async (id: string) => {
    const { error } = await supabase.from('saved_outfits').delete().eq('id', id);
    if (error) throw error;
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return { outfits, loading, saveOutfit, deleteOutfit, refetch: fetch };
}

export function usePreferences(userId: string | undefined) {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) console.error(error);
    else setPrefs(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const savePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!userId) return;
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      setPrefs(data);
    } else {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({ ...updates, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      setPrefs(data);
    }
  }, [userId]);

  return { prefs, loading, savePreferences, refetch: fetch };
}

export function useStylistChat(userId: string | undefined) {
  const [messages, setMessages] = useState<StylistChat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('stylist_chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) console.error(error);
    else setMessages(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addMessage = useCallback(async (role: 'user' | 'assistant', message: string) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('stylist_chats')
      .insert({ role, message, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    setMessages((prev) => [...prev, data]);
    return data;
  }, [userId]);

  const clearChat = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase.from('stylist_chats').delete().eq('user_id', userId);
    if (error) throw error;
    setMessages([]);
  }, [userId]);

  return { messages, loading, addMessage, clearChat };
}

export function useWeather() {
  const [weather, setWeather] = useState<{ temperature: number; feelsLike: number; description: string; condition: string; humidity: number; windSpeed: number; location: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const code = data.current?.weather_code ?? 0;
      const { temp, desc, condition } = mapWeatherCode(code);
      let location = 'Your Location';
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: { 'Accept-Language': 'en' },
        });
        const geoData = await geoRes.json();
        const addr = geoData.address;
        location = [addr?.city || addr?.town || addr?.village, addr?.country].filter(Boolean).join(', ') || location;
      } catch { /* keep default */ }
      setWeather({
        temperature: Math.round(data.current?.temperature_2m ?? 20),
        feelsLike: Math.round(data.current?.apparent_temperature ?? 20),
        description: desc,
        condition,
        humidity: Math.round(data.current?.relative_humidity_2m ?? 50),
        windSpeed: Math.round((data.current?.wind_speed_10m ?? 0) * 10) / 10,
        location,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get weather');
    }
    setLoading(false);
  }, []);

  return { weather, loading, error, fetchWeather };
}

function mapWeatherCode(code: number): { temp: string; desc: string; condition: string } {
  if (code === 0) return { temp: '', desc: 'Clear sky', condition: 'clear' };
  if (code <= 2) return { temp: '', desc: 'Partly cloudy', condition: 'cloud' };
  if (code === 3) return { temp: '', desc: 'Overcast', condition: 'cloud' };
  if (code <= 48) return { temp: '', desc: 'Foggy', condition: 'fog' };
  if (code <= 57) return { temp: '', desc: 'Drizzle', condition: 'rain' };
  if (code <= 67) return { temp: '', desc: 'Rain', condition: 'rain' };
  if (code <= 77) return { temp: '', desc: 'Snow', condition: 'snow' };
  if (code <= 82) return { temp: '', desc: 'Rain showers', condition: 'rain' };
  if (code <= 86) return { temp: '', desc: 'Snow showers', condition: 'snow' };
  if (code <= 99) return { temp: '', desc: 'Thunderstorm', condition: 'thunder' };
  return { temp: '', desc: 'Unknown', condition: 'cloud' };
}
