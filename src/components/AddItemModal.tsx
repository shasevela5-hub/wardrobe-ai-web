import { useState } from 'react';
import type { WardrobeItem } from '../lib/types';
import { CATEGORIES, SUBCATEGORIES, SEASONS, OCCASIONS, COLORS } from '../lib/constants';
import { Button } from './Button';
import { Icon } from './Icon';
import { useAuth } from '../lib/auth';
import { useWardrobeItems } from '../lib/hooks';

interface AddItemModalProps {
  onClose: () => void;
  editingItem?: WardrobeItem | null;
  onSaved?: () => void;
}

export function AddItemModal({ onClose, editingItem, onSaved }: AddItemModalProps) {
  const { user } = useAuth();
  const { addItem, updateItem } = useWardrobeItems(user?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(editingItem?.name ?? '');
  const [category, setCategory] = useState(editingItem?.category ?? 'tops');
  const [subcategory, setSubcategory] = useState(editingItem?.subcategory ?? '');
  const [color, setColor] = useState(editingItem?.color ?? '');
  const [colorHex, setColorHex] = useState(editingItem?.color_hex ?? '#9CA3AF');
  const [season, setSeason] = useState(editingItem?.season ?? 'all');
  const [occasion, setOccasion] = useState(editingItem?.occasion ?? 'casual');
  const [imageUrl, setImageUrl] = useState(editingItem?.image_url ?? '');
  const [notes, setNotes] = useState(editingItem?.notes ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        category,
        subcategory: subcategory || null,
        color: color || null,
        color_hex: colorHex,
        season,
        occasion,
        image_url: imageUrl || null,
        notes: notes || null,
      };
      if (editingItem) {
        await updateItem(editingItem.id, payload);
      } else {
        await addItem(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-earth-900/40 backdrop-blur-sm animate-fade-in p-0 sm:p-6">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b border-earth-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-serif text-xl font-bold text-earth-900">
            {editingItem ? 'Edit Item' : 'Add Clothing Item'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-earth-50 transition-colors">
            <Icon name="X" size={20} className="text-earth-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Item Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Blue Oxford Shirt" required />
          </div>

          <div>
            <label className="label">Category</label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => { setCategory(cat.value); setSubcategory(''); }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${category === cat.value ? 'border-gold-400 bg-gold-50 text-gold-700' : 'border-earth-200 text-earth-500 hover:border-earth-300'}`}
                >
                  <Icon name={cat.icon} size={20} />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Type</label>
            <select className="input" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              <option value="">Select type</option>
              {(SUBCATEGORIES[category] || []).map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Color</label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => { setColor(c.name); setColorHex(c.hex); }}
                  className={`relative h-10 rounded-lg border-2 transition-all ${colorHex === c.hex ? 'border-gold-400 scale-110' : 'border-earth-100'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {colorHex === c.hex && (
                    <Icon name="Check" size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
            <input className="input text-sm" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Or type a color name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Season</label>
              <select className="input" value={season} onChange={(e) => setSeason(e.target.value)}>
                {SEASONS.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Occasion</label>
              <select className="input capitalize" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o} className="capitalize">{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Photo URL (optional)</label>
            <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." type="url" />
            {imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden h-32 bg-earth-50">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input min-h-[80px] resize-none" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details about this item..." />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
            <Button type="submit" fullWidth loading={saving}>{editingItem ? 'Save Changes' : 'Add Item'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
