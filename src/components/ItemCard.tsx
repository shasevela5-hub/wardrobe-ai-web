import type { WardrobeItem } from '../lib/types';
import { Icon } from './Icon';

interface ItemCardProps {
  item: WardrobeItem;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ItemCard({ item, onClick, onEdit, onDelete }: ItemCardProps) {
  return (
    <div
      className="card overflow-hidden group cursor-pointer transition-all hover:shadow-md animate-scale-in"
      onClick={onClick}
    >
      <div className="aspect-square bg-earth-50 relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ backgroundColor: item.color_hex + '20' }}>
            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: item.color_hex }} />
            <Icon name="Shirt" size={28} className="text-earth-300" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge bg-white/90 backdrop-blur text-earth-700 capitalize">{item.category}</span>
        </div>
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-earth-600 hover:text-gold-600 transition-colors"
              >
                <Icon name="Edit" size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-earth-600 hover:text-red-500 transition-colors"
              >
                <Icon name="Trash2" size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-earth-900 truncate">{item.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-earth-400 capitalize">{item.occasion}</span>
          {item.times_worn > 0 && (
            <span className="text-xs text-earth-300">Worn {item.times_worn}x</span>
          )}
        </div>
      </div>
    </div>
  );
}
