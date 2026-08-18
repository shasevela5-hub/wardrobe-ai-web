import {
  Shirt, Footprints, Cloud, Glasses, Home, Sparkles, Heart, Settings,
  Plus, Trash2, Edit, Star, Search, X, Check, ChevronRight, ChevronLeft,
  RefreshCw, Thermometer, Droplets, Wind, MapPin, Send, LogOut, User,
  CloudRain, Sun, CloudSnow, Loader2, ShoppingBag, Wand2, Save, Share,
  Menu, Filter,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt, Footprints, Cloud, Glasses, Home, Sparkles, Heart, Settings,
  Plus, Trash2, Edit, Star, Search, X, Check, ChevronRight, ChevronLeft,
  RefreshCw, Thermometer, Droplets, Wind, MapPin, Send, LogOut, User,
  CloudRain, Sun, CloudSnow, Loader2, ShoppingBag, Wand2, Save, Share,
  Menu, Filter,
};

interface IconProps {
  name: keyof typeof ICON_MAP | string;
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}

export function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
  const Cmp = ICON_MAP[name] || Shirt;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} />;
}
