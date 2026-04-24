import { useState } from 'react';
import { Search, TrendingUp, Sparkles, SlidersHorizontal, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Dance AI', 'Cinematic', 'Anime', 'Cyberpunk', 'Realistic'];

const EXPLORE_DATA = [
  { id: 1, title: 'Neon Night City', type: 'Cinematic', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80' },
  { id: 2, title: 'Beat Sync Drop', type: 'Dance AI', image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80' },
  { id: 3, title: 'Abstract Flow', type: 'Realistic', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
  { id: 4, title: 'Desert Voyager', type: 'Cinematic', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&q=80' },
  { id: 5, title: 'Future Bass', type: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80' },
  { id: 6, title: 'Cyber Samurai', type: 'Anime', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80' },
];

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = EXPLORE_DATA.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pt-8 md:pt-0">
          <div>
            <h1 className="text-3xl font-display font-bold">Discover</h1>
            <p className="text-gray-400 mt-1">Trending AI creations and beats</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#B200FF] transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts, creators, beats..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#B200FF] focus:bg-white/10 transition-colors placeholder:text-gray-500 text-white"
              />
            </div>
            <button className="glass-button p-3 aspect-square flex items-center justify-center hover:bg-white/10 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 snap-start tracking-wide ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#B200FF] to-[#00E5FF] text-white shadow-[0_0_15px_rgba(178,0,255,0.3)] border border-transparent' 
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
          <div className="w-4 shrink-0 md:hidden" />
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-[#FF5E00]" />
            <h2 className="text-2xl font-bold font-display">{activeCategory === 'All' ? 'Trending Now' : `${activeCategory} Trends`}</h2>
          </div>
          
          {filteredData.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredData.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={item.id} 
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 text-white ml-1" />
                       </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded-md backdrop-blur-md border border-[#00E5FF]/20 inline-block mb-2">
                        {item.type}
                      </span>
                      <h3 className="font-bold text-base md:text-lg leading-tight text-white mb-1 shadow-black drop-shadow-md">{item.title}</h3>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-[#B200FF]" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search or categories.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
