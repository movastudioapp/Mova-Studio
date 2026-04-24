import { useState } from 'react';
import { FolderOpen, Music2, Image as ImageIcon, Video, Box, Plus, MoreVertical, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_ASSETS = [
  { id: 1, type: 'video', name: 'Cyber City Loop', size: '12 MB', date: '2h ago', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 2, type: 'audio', name: 'Synthwave Bass', size: '4.2 MB', date: '5h ago', img: null },
  { id: 3, type: 'image', name: 'Neon Portrait', size: '1.8 MB', date: '1d ago', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
  { id: 4, type: 'video', name: 'Desert Drive', size: '24 MB', date: '2d ago', img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80' },
  { id: 5, type: 'audio', name: 'Lofi Beat 01', size: '3.1 MB', date: '3d ago', img: null },
  { id: 6, type: 'video', name: 'Abstract Flow', size: '18 MB', date: '4d ago', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&q=80' },
];

export default function AssetsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const assetTypes = [
    { label: 'All', count: DUMMY_ASSETS.length, id: 'All' },
    { label: 'Videos', count: DUMMY_ASSETS.filter(a => a.type === 'video').length, icon: Video, id: 'video' },
    { label: 'Beats', count: DUMMY_ASSETS.filter(a => a.type === 'audio').length, icon: Music2, id: 'audio' },
    { label: 'Images', count: DUMMY_ASSETS.filter(a => a.type === 'image').length, icon: ImageIcon, id: 'image' },
    { label: 'Packs', count: 0, icon: Box, id: 'pack' },
  ];

  const filteredAssets = activeFilter === 'All' 
    ? DUMMY_ASSETS 
    : DUMMY_ASSETS.filter(a => a.type === activeFilter);

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <div className="flex justify-between items-center mb-8 pt-8 md:pt-0">
          <div>
            <h1 className="text-3xl font-display font-bold">Your Library</h1>
            <p className="text-gray-400 mt-1">Manage your generated assets and beats</p>
          </div>
          <button className="glass-button px-4 py-2 flex items-center gap-2 bg-[#B200FF]/20 hover:bg-[#B200FF]/40 border-[#B200FF]/30 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-medium hidden md:inline tracking-wide">Upload</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 pb-6 mb-2 overflow-x-auto hide-scrollbar snap-x items-center">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeFilter === type.id;
            return (
              <button
                key={type.label}
                onClick={() => setActiveFilter(type.id)}
                className={`flex-shrink-0 h-10 relative flex items-center justify-center gap-2 px-5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-bold border snap-start tracking-wide ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#B200FF]/20 text-white border-[#00E5FF]/50 shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                    : 'bg-white/5 text-white/50 border-transparent hover:text-white hover:bg-white/10'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-[#00E5FF]' : 'text-white/60'}`} />}
                <span className="relative z-10">{type.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ml-1 relative z-10 transition-colors ${isActive ? 'bg-[#00E5FF]/30 text-white font-bold' : 'bg-white/10 text-white/60'}`}>{type.count}</span>
              </button>
            )
          })}
          {/* Spacer for scroll */}
          <div className="w-4 shrink-0 md:hidden" />
        </div>

        {/* Grid Output */}
        {filteredAssets.length > 0 ? (
           <motion.div 
             layout
             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8"
           >
             <AnimatePresence>
               {filteredAssets.map(asset => (
                 <motion.div 
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.2 }}
                   key={asset.id} 
                   className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                 >
                   {asset.type === 'audio' ? (
                     <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-[#1A1A24] to-[#0A0A0F]">
                       <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mb-4 text-[#00E5FF] group-hover:scale-110 transition-transform">
                         <Play className="w-6 h-6 ml-1" />
                       </div>
                       <Music2 className="absolute top-4 right-4 w-5 h-5 text-white/20" />
                     </div>
                   ) : (
                     <img src={asset.img!} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end">
                      <div className="flex justify-between items-end">
                        <div>
                           <h3 className="font-bold text-sm text-white truncate max-w-[120px]">{asset.name}</h3>
                           <p className="text-xs text-white/50">{asset.size} • {asset.date}</p>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors">
                          <MoreVertical className="w-4 h-4 text-white" />
                        </button>
                      </div>
                   </div>

                   {asset.type === 'video' && (
                     <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                       <Video className="w-3 h-3 text-white" />
                       <span className="text-[10px] font-bold">1080p</span>
                     </div>
                   )}
                 </motion.div>
               ))}
             </AnimatePresence>
           </motion.div>
        ) : (
          <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/[0.02] mb-12 min-h-[300px]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">No {activeFilter} Found</h3>
            <p className="text-gray-400 max-w-sm mb-6">
              Upload audio, images, or start generating videos in the Studio to build your library.
            </p>
            <button onClick={() => setActiveFilter('All')} className="glass-button px-6 py-3 bg-white/10 font-medium">
              View All Assets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
