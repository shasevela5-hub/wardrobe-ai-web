import { useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { useSavedOutfits, useWardrobeItems } from '../lib/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { ItemDisplay } from '../components/ItemDisplay';
import type { WardrobeItem } from '../lib/types';

export function FavoritesScreen() {
  const { user } = useAuth();
  const { outfits, loading, deleteOutfit } = useSavedOutfits(user?.id);
  const { items } = useWardrobeItems(user?.id);

  const itemMap = useMemo(() => {
    const map = new Map<string, WardrobeItem>();
    items.forEach((it) => map.set(it.id, it));
    return map;
  }, [items]);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this saved outfit?')) {
      await deleteOutfit(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">Saved Outfits</h1>
        <p className="text-earth-500 mt-1">Your favorite looks, ready to wear again</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={28} className="animate-spin text-earth-300" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-earth-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="Heart" size={32} className="text-earth-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">No saved outfits yet</h3>
          <p className="text-earth-500 text-sm">Go to the Home tab and save outfit suggestions you love.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {outfits.map((outfit) => {
            const top = outfit.top_id ? itemMap.get(outfit.top_id) : null;
            const bottom = outfit.bottom_id ? itemMap.get(outfit.bottom_id) : null;
            const outerwear = outfit.outerwear_id ? itemMap.get(outfit.outerwear_id) : null;
            const footwear = outfit.footwear_id ? itemMap.get(outfit.footwear_id) : null;
            const accessory = outfit.accessory_id ? itemMap.get(outfit.accessory_id) : null;
            const hasItems = top || bottom || outerwear || footwear || accessory;

            return (
              <div key={outfit.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-earth-900">{outfit.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {outfit.occasion && <span className="badge bg-gold-50 text-gold-700 capitalize">{outfit.occasion}</span>}
                      {outfit.weather_temp_min !== null && outfit.weather_temp_max !== null && (
                        <span className="badge bg-earth-50 text-earth-500">
                          <Icon name="Thermometer" size={12} />
                          {outfit.weather_temp_min}–{outfit.weather_temp_max}°C
                        </span>
                      )}
                      <span className="text-xs text-earth-400">
                        {new Date(outfit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(outfit.id)}
                    className="p-2 rounded-full text-earth-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>

                {hasItems ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {outerwear && <ItemDisplay label="Outerwear" item={outerwear} />}
                    {top && <ItemDisplay label="Top" item={top} />}
                    {bottom && <ItemDisplay label="Bottom" item={bottom} />}
                    {footwear && <ItemDisplay label="Footwear" item={footwear} />}
                    {accessory && <ItemDisplay label="Accessory" item={accessory} />}
                  </div>
                ) : (
                  <div className="bg-earth-50 rounded-xl p-6 text-center text-earth-400 text-sm">
                    Items from this outfit were removed from your wardrobe.
                  </div>
                )}

                {outfit.notes && (
                  <div className="mt-4 bg-earth-50 rounded-xl p-3 text-sm text-earth-600 flex items-start gap-2">
                    <Icon name="Sparkles" size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <span>{outfit.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
