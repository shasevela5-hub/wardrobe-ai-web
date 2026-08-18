import type { WardrobeItem } from '../lib/types';
import { Icon } from './Icon';

interface ItemDisplayProps {
  label: string;
  item: WardrobeItem;
}

export function ItemDisplay({ label, item }: ItemDisplayProps) {
  return (
    <div className="bg-earth-50 rounded-2xl overflow-hidden group transition-all hover:bg-earth-100">
      <div className="aspect-[4/5] bg-white relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: item.color_hex + '15' }}>
            <div className="w-16 h-16 rounded-full shadow-sm" style={{ backgroundColor: item.color_hex }} />
            <Icon name="Shirt" size={24} className="text-earth-300" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-earth-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <h3 className="font-medium text-sm text-earth-900 truncate">{item.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {item.color && <span className="text-xs text-earth-500">{item.color}</span>}
          {item.subcategory && <span className="text-xs text-earth-300">• {item.subcategory}</span>}
        </div>
      </div>
    </div>
  );
}
