import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, RefreshCw, X, Loader2, Search, Leaf, Flame, Star, Upload, Camera } from 'lucide-react';
import { fetchAllMenuItems, fetchCategories, createMenuItem, updateMenuItem, deleteMenuItem, uploadImage } from '../lib/api';

const emptyForm = {
  name: '', description: '', price: '', image_url: '',
  category_id: '', is_featured: false, is_vegetarian: false, is_spicy: false, is_available: true
};

function MenuItemModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(item ? {
    name: item.name, description: item.description || '', price: item.price,
    image_url: item.image_url || '', category_id: item.category_id,
    is_featured: item.is_featured, is_vegetarian: item.is_vegetarian,
    is_spicy: item.is_spicy, is_available: item.is_available,
  } : { ...emptyForm });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(item?.image_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) {
      setError('Name, price, and category are required.');
      return;
    }
    setSaving(true);
    setError('');
    
    try {
      let finalImageUrl = form.image_url;

      // Upload image if a new one was selected
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.error) throw new Error(uploadRes.error);
        finalImageUrl = uploadRes.url;
      }

      const payload = { ...form, price: parseFloat(form.price), image_url: finalImageUrl };
      
      let result;
      if (item) {
        result = await updateMenuItem(item.id, payload);
      } else {
        result = await createMenuItem(payload);
      }
      if (result.error) throw new Error(result.error);
      onSave(result, !!item);
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#1a1a1a] border border-mehfil-gold/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-mehfil-gold/15 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-cinzel text-mehfil-gold">{item ? 'Edit Dish' : 'Add New Dish'}</h2>
          <button onClick={onClose} className="text-mehfil-ivory/40 hover:text-mehfil-ivory transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="text-red-400 text-sm font-serif bg-red-400/10 border border-red-400/20 rounded-xl p-3">{error}</div>}

          <div>
            <label className="text-xs text-mehfil-ivory/40 font-serif mb-1.5 block">Dish Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-[#0f0f0f] border border-mehfil-gold/15 rounded-xl px-4 py-3 text-sm text-mehfil-ivory focus:outline-none focus:border-mehfil-gold/40" />
          </div>

          <div>
            <label className="text-xs text-mehfil-ivory/40 font-serif mb-1.5 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full bg-[#0f0f0f] border border-mehfil-gold/15 rounded-xl px-4 py-3 text-sm text-mehfil-ivory resize-none focus:outline-none focus:border-mehfil-gold/40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mehfil-ivory/40 font-serif mb-1.5 block">Price (Rs) *</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" min="0" required
                className="w-full bg-[#0f0f0f] border border-mehfil-gold/15 rounded-xl px-4 py-3 text-sm text-mehfil-ivory focus:outline-none focus:border-mehfil-gold/40" />
            </div>
            <div>
              <label className="text-xs text-mehfil-ivory/40 font-serif mb-1.5 block">Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required
                className="w-full bg-[#0f0f0f] border border-mehfil-gold/15 rounded-xl px-4 py-3 text-sm text-mehfil-ivory focus:outline-none focus:border-mehfil-gold/40 appearance-none"
              >
                <option value="">Select…</option>
                {categories.map(c => <option key={c.id} value={c.id} className="bg-[#1a1a1a]">{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs text-mehfil-ivory/40 font-serif mb-1.5 block">Dish Image</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 bg-[#0f0f0f] border border-dashed border-mehfil-gold/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-mehfil-gold/50 transition-all relative overflow-hidden group"
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/60 text-mehfil-ivory px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                      <Camera size={16} /> Change Photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-mehfil-gold/10 flex items-center justify-center mx-auto mb-3 text-mehfil-gold">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-serif text-mehfil-gold">Click to Upload or Take a Photo</p>
                  <p className="text-xs font-serif text-mehfil-ivory/30 mt-1">Accepts JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              { name: 'is_featured', label: 'Featured Dish', icon: <Star size={14} /> },
              { name: 'is_vegetarian', label: 'Vegetarian', icon: <Leaf size={14} /> },
              { name: 'is_spicy', label: 'Spicy', icon: <Flame size={14} /> },
              { name: 'is_available', label: 'Available', icon: null },
            ].map(({ name, label, icon }) => (
              <label key={name} className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-[#0f0f0f] border border-mehfil-gold/10 hover:border-mehfil-gold/25 transition-colors">
                <div className="flex items-center gap-2 text-sm font-serif text-mehfil-ivory/70">
                  {icon && <span className="text-mehfil-gold">{icon}</span>}
                  {label}
                </div>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${form[name] ? 'bg-mehfil-gold' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[name] ? 'left-5' : 'left-0.5'}`} />
                  <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only" />
                </div>
              </label>
            ))}
          </div>

          <button type="submit" disabled={saving}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : (item ? 'Save Changes' : 'Add Dish')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function MenuCard({ item, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setDeleting(true);
    await onDelete(item.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl overflow-hidden group hover:border-mehfil-gold/25 transition-all duration-300 ${!item.is_available ? 'opacity-50' : ''}`}
    >
      <div className="h-40 overflow-hidden relative">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {item.is_featured && <span className="text-[10px] bg-mehfil-gold text-mehfil-black px-2 py-0.5 rounded-full font-cinzel flex items-center gap-1"><Star size={8} fill="currentColor" /> Featured</span>}
          {item.is_vegetarian && <span className="text-[10px] bg-green-500/80 text-white px-2 py-0.5 rounded-full font-cinzel">Veg</span>}
          {item.is_spicy && <span className="text-[10px] bg-red-500/80 text-white px-2 py-0.5 rounded-full font-cinzel">Spicy</span>}
          {!item.is_available && <span className="text-[10px] bg-gray-500/80 text-white px-2 py-0.5 rounded-full font-cinzel">Unavailable</span>}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-cinzel text-mehfil-gold text-sm leading-tight flex-1 pr-2">{item.name}</h3>
          <span className="text-mehfil-gold font-serif text-sm whitespace-nowrap">Rs {item.price}</span>
        </div>
        <p className="text-mehfil-ivory/40 text-xs font-serif line-clamp-2 mb-3">{item.description}</p>
        <div className="text-[10px] text-mehfil-gold/40 font-cinzel tracking-widest mb-3">{item.category}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-serif py-2 rounded-xl bg-mehfil-gold/10 border border-mehfil-gold/20 text-mehfil-gold hover:bg-mehfil-gold/20 transition-all"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-1.5 text-xs font-serif py-2 px-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-all disabled:opacity-50"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | item object

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [menuData, catData] = await Promise.all([fetchAllMenuItems(), fetchCategories()]);
      setItems(menuData || []);
      setCategories(catData || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (savedItem, isEdit) => {
    if (isEdit) {
      setItems(prev => prev.map(i => i.id === savedItem.id ? { ...i, ...savedItem } : i));
    } else {
      setItems(prev => [savedItem, ...prev]);
    }
    setModal(null);
    load(); // refresh to get category name
  };

  const handleDelete = async (id) => {
    await deleteMenuItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filtered = items.filter(i =>
    (filterCat === 'all' || i.category === filterCat) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cinzel text-mehfil-gold">Menu Management</h1>
          <p className="text-mehfil-ivory/40 text-xs font-serif mt-1">{items.length} dishes total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-mehfil-gold/10 border border-mehfil-gold/30 rounded-xl text-mehfil-gold text-sm font-serif hover:bg-mehfil-gold/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setModal('add')}
            className="flex items-center gap-2 px-5 py-2 btn-primary text-sm rounded-xl"
          >
            <Plus size={16} /> Add Dish
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mehfil-ivory/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes…"
            className="w-full bg-[#1a1a1a] border border-mehfil-gold/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-mehfil-ivory placeholder:text-mehfil-ivory/25 focus:outline-none focus:border-mehfil-gold/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['all', ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`text-xs px-4 py-2 rounded-full border whitespace-nowrap font-serif transition-all ${filterCat === cat ? 'bg-mehfil-gold text-mehfil-black border-mehfil-gold' : 'border-mehfil-gold/20 text-mehfil-ivory/50 hover:border-mehfil-gold/40'}`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-mehfil-gold/30 border-t-mehfil-gold rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map(item => (
              <MenuCard key={item.id} item={item} onEdit={setModal} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-mehfil-ivory/30 font-serif">
              No dishes found.
            </div>
          )}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <MenuItemModal
            item={modal === 'add' ? null : modal}
            categories={categories}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
