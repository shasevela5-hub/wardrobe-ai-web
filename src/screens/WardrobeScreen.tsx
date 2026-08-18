import { useState, useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { useWardrobeItems } from '../lib/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { ItemCard } from '../components/ItemCard';
import { AddItemModal } from '../components/AddItemModal';
import { CATEGORIES } from '../lib/constants';
import type { WardrobeItem } from '../lib/types';

export function WardrobeScreen() {
  const { user } = useAuth();
  const { items, loading, deleteItem, incrementWorn } = useWardrobeItems(user?.id);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter !== 'all' && item.category !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) ||
          (item.color?.toLowerCase().includes(q) ?? false) ||
          (item.subcategory?.toLowerCase().includes(q) ?? false) ||
          item.occasion.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, filter, search]);

  const handleDelete = async (id: string) => {
    if (confirm('Remove this item from your wardrobe?')) {
      await deleteItem(id);
    }
  };

  const handleWorn = async (id: string) => {
    await incrementWorn(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">My Wardrobe</h1>
          <p className="text-earth-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your collection</p>
        </div>
        <Button icon="Plus" onClick={() => { setEditingItem(null); setShowAdd(true); }}>
          <span className="hidden sm:inline">Add Item</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-300" />
          <input
            className="input pl-10"
            placeholder="Search your wardrobe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`badge px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${filter === 'all' ? 'bg-gold-400 text-earth-900' : 'bg-white text-earth-500 border border-earth-200'}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`badge px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${filter === cat.value ? 'bg-gold-400 text-earth-900' : 'bg-white text-earth-500 border border-earth-200'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={28} className="animate-spin text-earth-300" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-earth-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="Shirt" size={32} className="text-earth-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">
            {search || filter !== 'all' ? 'No items found' : 'Your wardrobe is empty'}
          </h3>
          <p className="text-earth-500 text-sm mb-4">
            {search || filter !== 'all' ? 'Try adjusting your search or filters.' : 'Start building your digital closet.'}
          </p>
          {!search && filter === 'all' && (
            <Button icon="Plus" onClick={() => setShowAdd(true)}>Add Your First Item</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => { setEditingItem(item); setShowAdd(true); }}
              onDelete={() => handleDelete(item.id)}
              onClick={() => handleWorn(item.id)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
