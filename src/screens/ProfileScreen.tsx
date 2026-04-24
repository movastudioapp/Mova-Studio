import { useState } from 'react';
import { Settings, Grid, Heart, Music2, Share2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_CREATIONS = [
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80',
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'creations' | 'likes' | 'beats'>('creations');

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-[#B200FF] via-[#00E5FF] to-[#FF007F] relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2">
          <button className="glass-button p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mx-4 md:-mx-8">
        <div className="relative -mt-16 md:-mt-20 mb-8 px-4 md:px-8 flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#05050D] overflow-hidden bg-gray-800 shadow-2xl relative z-10 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-display font-bold">Alex Chen</h1>
            <p className="text-[#00E5FF] font-medium tracking-wide">@alex_synth</p>
            <p className="mt-2 text-sm max-w-md text-gray-300">Cyberpunk enthusiast | AI Director | Curating the best synthwave beats and visuals for the future.</p>
          </div>

          <div className="flex gap-3 pb-2 shrink-0">
            <button className="glass-button px-6 py-2 bg-white text-black hover:bg-gray-200 font-bold border-none transition-colors">
              Edit Profile
            </button>
            <button className="glass-button p-2 hover:bg-white/10 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 px-4 md:px-8">
          <div className="glass-panel p-4 text-center rounded-2xl">
            <div className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#B200FF]">142</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Videos</div>
          </div>
          <div className="glass-panel p-4 text-center rounded-2xl">
            <div className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B200FF] to-[#FF007F]">38</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Beats</div>
          </div>
          <div className="glass-panel p-4 text-center rounded-2xl">
            <div className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#FF5E00]">12.4K</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Likes</div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 md:px-8">
          <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 relative">
            <div 
               className="absolute top-1.5 bottom-1.5 bg-white/10 rounded-xl shadow-sm border border-white/10 transition-all duration-300"
               style={{ 
                 width: 'calc(33.33% - 4px)',
                 transform: `translateX(${activeTab === 'creations' ? '0' : activeTab === 'likes' ? 'calc(100% + 4px)' : 'calc(200% + 8px)'})`
               }} 
            />
            <button 
              onClick={() => setActiveTab('creations')} 
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold text-sm tracking-wide relative z-10 transition-colors ${activeTab === 'creations' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Creations</span>
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold text-sm tracking-wide relative z-10 transition-colors ${activeTab === 'likes' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Likes</span>
            </button>
            <button 
              onClick={() => setActiveTab('beats')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold text-sm tracking-wide relative z-10 transition-colors ${activeTab === 'beats' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <Music2 className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Beats</span>
            </button>
          </div>

          {/* Grid Placeholders */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 pb-8 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {activeTab === 'creations' && DUMMY_CREATIONS.map((img, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={`creation-${i}`} 
                  className="aspect-[3/4] bg-white/5 rounded-xl md:rounded-2xl relative group overflow-hidden cursor-pointer border border-white/10"
                >
                  <img src={img} alt="Creation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition duration-300">
                       <Play className="w-5 h-5 text-white ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeTab === 'likes' && DUMMY_CREATIONS.slice().reverse().map((img, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={`like-${i}`} 
                  className="aspect-[3/4] bg-white/5 rounded-xl md:rounded-2xl relative group overflow-hidden cursor-pointer border border-white/10"
                >
                  <img src={img} alt="Like" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="absolute top-4 right-4">
                       <Heart className="w-5 h-5 text-[#FF007F] fill-[#FF007F]" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition duration-300">
                       <Play className="w-5 h-5 text-white ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'beats' && [1, 2, 3].map((_, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={`beat-${i}`} 
                  className="aspect-[3/4] bg-gradient-to-br from-[#1A1A24] to-[#0A0A0F] rounded-xl md:rounded-2xl relative group overflow-hidden cursor-pointer border border-white/10 flex flex-col justify-center items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mb-4 text-[#00E5FF] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Beat Track {i + 1}</h4>
                  <p className="text-xs text-white/50">Mova Studio • 0:30</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
