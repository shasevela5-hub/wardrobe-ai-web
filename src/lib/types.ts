export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  subcategory: string | null;
  color: string | null;
  color_hex: string;
  season: string;
  occasion: string;
  image_url: string | null;
  times_worn: number;
  notes: string | null;
  created_at: string;
}

export interface SavedOutfit {
  id: string;
  user_id: string;
  name: string;
  top_id: string | null;
  bottom_id: string | null;
  outerwear_id: string | null;
  footwear_id: string | null;
  accessory_id: string | null;
  occasion: string | null;
  weather_temp_min: number | null;
  weather_temp_max: number | null;
  notes: string | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  style_preferences: string[];
  body_type: string | null;
  favorite_colors: string[];
  avoid_colors: string[];
  top_size: string | null;
  bottom_size: string | null;
  shoe_size: string | null;
  weather_sensitivity: string;
  occasion_frequency: Record<string, number>;
}

export interface StylistChat {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  context: Record<string, unknown> | null;
  created_at: string;
}

export interface OutfitRating {
  id: string;
  user_id: string;
  outfit_id: string;
  rating: number;
  created_at: string;
}

export interface OutfitSuggestion {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  outerwear: WardrobeItem | null;
  footwear: WardrobeItem | null;
  accessory: WardrobeItem | null;
  title: string;
  description: string;
  stylingTips: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}
