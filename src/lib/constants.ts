export const CATEGORIES = [
  { value: 'tops', label: 'Tops', icon: 'Shirt' },
  { value: 'bottoms', label: 'Bottoms', icon: 'Footprints' },
  { value: 'outerwear', label: 'Outerwear', icon: 'Cloud' },
  { value: 'footwear', label: 'Footwear', icon: 'Footprints' },
  { value: 'accessories', label: 'Accessories', icon: 'Glasses' },
] as const;

export const SUBCATEGORIES: Record<string, string[]> = {
  tops: ['T-Shirt', 'Button-Up', 'Blouse', 'Sweater', 'Tank Top', 'Polo'],
  bottoms: ['Jeans', 'Chinos', 'Shorts', 'Skirt', 'Dress Pants', 'Leggings'],
  outerwear: ['Jacket', 'Coat', 'Blazer', 'Cardigan', 'Hoodie', 'Vest'],
  footwear: ['Sneakers', 'Boots', 'Dress Shoes', 'Sandals', 'Heels', 'Flats'],
  accessories: ['Watch', 'Belt', 'Hat', 'Scarf', 'Sunglasses', 'Bag'],
};

export const SEASONS = ['all', 'spring', 'summer', 'fall', 'winter'] as const;

export const OCCASIONS = [
  'casual', 'work', 'formal', 'athletic', 'loungewear', 'night out', 'date', 'travel',
] as const;

export const COLORS = [
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'White', hex: '#F5F5F5' },
  { name: 'Gray', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Light Blue', hex: '#7DD3FC' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Olive', hex: '#65734F' },
  { name: 'Brown', hex: '#8B6F47' },
  { name: 'Tan', hex: '#D4A574' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Burgundy', hex: '#7F1D1D' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Cream', hex: '#FDF6E3' },
];

export const STYLE_PREFERENCES = [
  'casual', 'formal', 'trendy', 'minimal', 'sporty', 'bohemian', 'classic', 'streetwear',
];

export const BODY_TYPES = ['petite', 'average', 'tall', 'curvy', 'athletic'];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const WEATHER_SENSITIVITY = [
  { value: 'cold', label: 'I get cold easily' },
  { value: 'neutral', label: 'Average' },
  { value: 'warm', label: 'I get warm easily' },
];
