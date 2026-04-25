import { useState } from 'react';
import { Search, TrendingUp, Sparkles, SlidersHorizontal, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '../lib/convex-api-shim';

const CATEGORIES = ['All', 'video', 'audio', 'image'];

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const assets = useQuery(api.assets.listAllAssets, { limit: 50 });

  const filteredData = assets ? assets.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) : [];

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-transparent">
      {/* Header & Search - Native Mobile Style */}
      <header className="sticky top-0 z-30 w-full bg-gradient-to-b from-[#05050D] to-[#05050D]/0 backdrop-blur-xl pt-safe">
        <div className="px-4 md:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">Discover</h1>
              <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-medium">Trending AI Creations</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-white/60" />
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, creators, beats..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all placeholder:text-white/20 text-white"
            />
          </div>
        </div>

        {/* Categories - Sticky below search */}
        <div className="flex gap-2.5 px-4 md:px-8 pb-4 overflow-x-auto hide-scrollbar whitespace-nowrap snap-x">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 snap-start border ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm' 
                    : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
          <div className="w-4 shrink-0" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full">
        <div className="w-full mx-auto">
          {/* Trending Section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#FF5E00]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FF5E00]" />
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight">{activeCategory === 'All' ? 'Trending Now' : `${activeCategory} Trends`}</h2>
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
                    key={item._id} 
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30"
                  >
                    <img 
                      src={item.thumbnailUrl || item.url} 
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
