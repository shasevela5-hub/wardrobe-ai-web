import type { WardrobeItem, OutfitSuggestion, WeatherData } from './types';
import { OCCASIONS } from './constants';

const SEASON_MAP: Record<string, string[]> = {
  spring: ['spring', 'all'],
  summer: ['summer', 'all'],
  fall: ['fall', 'all'],
  winter: ['winter', 'all'],
};

export function getSeasonFromDate(date: Date = new Date()): keyof typeof SEASON_MAP {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function isSeasonAppropriate(item: WardrobeItem, season: string): boolean {
  if (item.season === 'all') return true;
  const validSeasons = SEASON_MAP[season] || ['all'];
  return validSeasons.includes(item.season);
}

function isWeatherAppropriate(item: WardrobeItem, tempC: number): boolean {
  const sub = (item.subcategory || '').toLowerCase();
  const category = item.category;

  if (tempC < 5) {
    if (category === 'tops' && sub.includes('tank')) return false;
    if (category === 'bottoms' && sub.includes('shorts')) return false;
    if (category === 'footwear' && sub.includes('sandals')) return false;
  } else if (tempC > 25) {
    if (category === 'outerwear') {
      if (sub.includes('coat') || sub.includes('blazer') || sub.includes('hoodie')) return false;
    }
    if (category === 'tops' && sub.includes('sweater')) return false;
  }

  if (tempC > 20 && category === 'outerwear' && sub.includes('coat')) return false;
  if (tempC < 10 && category === 'tops' && sub.includes('tank')) return false;

  return true;
}

function scoreItem(
  item: WardrobeItem,
  context: { occasion: string; season: string; temp: number; preferences?: { favColors: string[]; avoidColors: string[] } }
): number {
  let score = 100;

  if (!isSeasonAppropriate(item, context.season)) score -= 40;
  if (!isWeatherAppropriate(item, context.temp)) score -= 50;

  if (item.occasion === context.occasion) score += 30;
  else if (item.occasion === 'casual' && context.occasion !== 'formal') score += 10;

  score -= Math.min(item.times_worn * 3, 30);

  if (context.preferences) {
    if (context.preferences.favColors.includes(item.color_hex)) score += 20;
    if (context.preferences.avoidColors.includes(item.color_hex)) score -= 30;
  }

  const sub = (item.subcategory || '').toLowerCase();
  if (context.temp > 25 && (sub.includes('linen') || sub.includes('light'))) score += 15;
  if (context.temp < 5 && (sub.includes('thermal') || sub.includes('wool'))) score += 15;

  return score;
}

function pickBest(items: WardrobeItem[], scored: Map<string, number>): WardrobeItem | null {
  if (items.length === 0) return null;
  const sorted = [...items].sort((a, b) => (scored.get(b.id) || 0) - (scored.get(a.id) || 0));
  const top = sorted.slice(0, Math.min(3, sorted.length));
  return top[Math.floor(Math.random() * top.length)];
}

function describeOutfit(
  top: WardrobeItem | null,
  bottom: WardrobeItem | null,
  outerwear: WardrobeItem | null,
  footwear: WardrobeItem | null,
  occasion: string
): { title: string; description: string; stylingTips: string } {
  const parts: string[] = [];
  if (outerwear) parts.push(outerwear.name);
  if (top) parts.push(top.name);
  if (bottom) parts.push(bottom.name);

  const title = occasion === 'work' ? 'Smart Office Look'
    : occasion === 'formal' ? 'Elegant Evening Look'
    : occasion === 'athletic' ? 'Active Outfit'
    : occasion === 'night out' ? 'Night Out Look'
    : occasion === 'date' ? 'Date Night Look'
    : 'Everyday Casual Look';

  const description = parts.length > 0
    ? `A ${occasion} outfit featuring ${parts.join(', ').toLowerCase()}${footwear ? `, paired with ${footwear.name.toLowerCase()}` : ''}.`
    : 'Complete your wardrobe to get full outfit suggestions.';

  const tips: string[] = [];
  if (top && bottom) {
    const topColor = top.color?.toLowerCase() || '';
    const bottomColor = bottom.color?.toLowerCase() || '';
    if (topColor === bottomColor && topColor !== '') {
      tips.push('Break up the monochrome by adding a contrasting accessory.');
    } else {
      tips.push('The color combination creates a balanced, cohesive look.');
    }
  }
  if (outerwear) {
    tips.push(`Layer the ${outerwear.name.toLowerCase()} for versatility — remove it indoors if needed.`);
  }
  if (footwear) {
    tips.push(`The ${footwear.name.toLowerCase()} anchors the outfit for ${occasion} occasions.`);
  }
  if (tips.length === 0) {
    tips.push('Add more items to your wardrobe for richer styling suggestions.');
  }

  return {
    title,
    description,
    stylingTips: tips.join(' '),
  };
}

export function generateOutfitSuggestions(
  items: WardrobeItem[],
  options: { occasion: string; season?: string; temp?: number; preferences?: { favColors: string[]; avoidColors: string[] } },
  count: number = 3
): OutfitSuggestion[] {
  const season = options.season || getSeasonFromDate();
  const temp = options.temp ?? 20;
  const occasion = options.occasion || 'casual';

  const scored = new Map<string, number>();
  items.forEach((item) => {
    scored.set(item.id, scoreItem(item, { occasion, season, temp, preferences: options.preferences }));
  });

  const byCategory = {
    tops: items.filter((i) => i.category === 'tops'),
    bottoms: items.filter((i) => i.category === 'bottoms'),
    outerwear: items.filter((i) => i.category === 'outerwear'),
    footwear: items.filter((i) => i.category === 'footwear'),
    accessories: items.filter((i) => i.category === 'accessories'),
  };

  const suggestions: OutfitSuggestion[] = [];
  const usedItems = new Set<string>();

  for (let i = 0; i < count; i++) {
    const availableItems = items.filter((it) => !usedItems.has(it.id));
    if (availableItems.length === 0 && i > 0) break;

    const availByCat = {
      tops: byCategory.tops.filter((it) => !usedItems.has(it.id)),
      bottoms: byCategory.bottoms.filter((it) => !usedItems.has(it.id)),
      outerwear: byCategory.outerwear.filter((it) => !usedItems.has(it.id)),
      footwear: byCategory.footwear.filter((it) => !usedItems.has(it.id)),
      accessories: byCategory.accessories.filter((it) => !usedItems.has(it.id)),
    };

    const top = pickBest(availByCat.tops, scored);
    if (top) usedItems.add(top.id);
    const bottom = pickBest(availByCat.bottoms, scored);
    if (bottom) usedItems.add(bottom.id);

    const outerwear = temp < 18 ? pickBest(availByCat.outerwear, scored) : null;
    if (outerwear) usedItems.add(outerwear.id);

    const footwear = pickBest(availByCat.footwear, scored);
    if (footwear) usedItems.add(footwear.id);

    const accessory = Math.random() > 0.4 ? pickBest(availByCat.accessories, scored) : null;
    if (accessory) usedItems.add(accessory.id);

    const meta = describeOutfit(top, bottom, outerwear, footwear, occasion);

    suggestions.push({
      top, bottom, outerwear, footwear, accessory,
      title: meta.title,
      description: meta.description,
      stylingTips: meta.stylingTips,
    });
  }

  return suggestions;
}

export function getWeatherRecommendation(weather: WeatherData): {
  occasion: string;
  recommendation: string;
  itemTypes: string[];
} {
  const temp = weather.temperature;
  const condition = weather.condition.toLowerCase();

  let occasion = 'casual';
  let recommendation = '';
  let itemTypes: string[] = [];

  if (temp < 0) {
    occasion = 'casual';
    recommendation = 'Bundle up with warm layers and winter accessories for freezing temperatures.';
    itemTypes = ['Winter Coat', 'Thermal Layers', 'Scarf', 'Winter Boots', 'Gloves'];
  } else if (temp < 10) {
    recommendation = 'Layer up with a light jacket or sweater for cool weather.';
    itemTypes = ['Light Jacket', 'Long Sleeves', 'Jeans', 'Closed Shoes'];
  } else if (temp < 20) {
    recommendation = 'Perfect for transitional pieces. A light sweater or jacket works well.';
    itemTypes = ['Sweater', 'Jeans', 'Sneakers', 'Light Jacket'];
  } else if (temp < 25) {
    recommendation = 'Comfortable weather for lighter clothing. Breathable fabrics work best.';
    itemTypes = ['T-Shirt', 'Light Pants', 'Sneakers'];
  } else {
    recommendation = 'Stay cool with lightweight, breathable clothing and sun protection.';
    itemTypes = ['T-Shirt', 'Shorts', 'Sandals', 'Sunglasses'];
  }

  if (condition.includes('rain')) {
    recommendation += ' Don\'t forget a waterproof jacket or umbrella!';
    itemTypes.push('Raincoat', 'Waterproof Shoes');
  } else if (condition.includes('snow')) {
    recommendation = 'Snowy conditions! Wear insulated, waterproof clothing.';
    itemTypes = ['Winter Coat', 'Snow Boots', 'Thermal Layers', 'Hat', 'Gloves'];
  } else if (condition.includes('clear') || condition.includes('sun')) {
    recommendation += ' Sunny day — consider sunglasses and sun protection.';
    itemTypes.push('Sunglasses', 'Hat');
  }

  return { occasion, recommendation, itemTypes };
}

export function getRandomOccasion(): string {
  return OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)];
}
