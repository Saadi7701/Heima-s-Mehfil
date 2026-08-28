import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Loader2, ShoppingCart } from 'lucide-react';
import { fetchMenuItems, fetchCategories } from '../lib/api';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [categories, setCategories] = useState(['All']);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, items] = await Promise.all([
          fetchCategories(),
          fetchMenuItems()
        ]);
        
        setCategories(['All', ...cats.map(c => c.name)]);
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-mehfil-black flex items-center justify-center">
        <Loader2 className="animate-spin text-mehfil-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mehfil-black pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-cinzel text-mehfil-gold mb-6"
          >
            Culinary Offerings
          </motion.h1>
          <div className="w-24 h-px bg-mehfil-gold/50 mx-auto mb-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-mehfil-gold"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
          <div className="flex space-x-2 md:space-x-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 whitespace-nowrap ${activeCategory === cat ? 'bg-mehfil-gold text-mehfil-black border-mehfil-gold' : 'border-mehfil-gold/30 text-mehfil-ivory hover:border-mehfil-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-mehfil-gold/50 py-2 pl-2 pr-10 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors"
            />
            <Search className="absolute right-2 top-2.5 text-mehfil-gold/70" size={18} />
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={item.id}
              className="glass-panel group overflow-hidden"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={item.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mehfil-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                  <button className="btn-primary py-2 px-6 text-sm">Quick View</button>
                  <button 
                    onClick={() => addToCart(item)}
                    className="btn-outline py-2 px-4 text-sm border-mehfil-ivory text-mehfil-ivory hover:bg-mehfil-ivory hover:text-mehfil-black flex items-center space-x-2"
                  >
                    <span>Add</span>
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-cinzel text-mehfil-gold">{item.name}</h3>
                  <span className="text-mehfil-ivory font-serif">Rs {item.price}</span>
                </div>
                <p className="text-mehfil-ivory/60 text-sm font-serif line-clamp-2">{item.description}</p>
                {/* Dietary Badges */}
                <div className="mt-4 flex space-x-2">
                  {item.is_vegetarian && <span className="text-xs border border-green-500/50 text-green-400 px-2 py-1 rounded">Vegetarian</span>}
                  {item.is_spicy && <span className="text-xs border border-red-500/50 text-red-400 px-2 py-1 rounded">Spicy</span>}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center text-mehfil-ivory/60 py-12">
               No culinary offerings found matching your search.
             </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
