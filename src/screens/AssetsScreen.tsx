import { useState } from 'react';
import { FolderOpen, Music2, Image as ImageIcon, Video, Box, Plus, MoreVertical, Play, Trash2, Download, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../lib/convex-api-shim';
import { useAuth } from '../components/auth/AuthProvider';

export default function AssetsScreen() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  
  const assets = useQuery(api.assets.listAssets, { userId: user?.uid || "" });
  const beatPacks = useQuery(api.beatPacks.getBeatPacksByUser, { userId: user?.uid || "" }); // Added
  const deleteAssetMutation = useMutation(api.assets.deleteAsset);

  const assetTypes = [
    { label: 'All', count: assets?.length || 0, id: 'All' },
    { label: 'Videos', count: assets?.filter(a => a.type === 'video').length || 0, icon: Video, id: 'video' },
    { label: 'Beats', count: assets?.filter(a => a.type === 'audio').length || 0, icon: Music2, id: 'audio' },
    { label: 'Beat Packs', count: 0, icon: Music2, id: 'beatPack' }, // Added
    { label: 'Images', count: assets?.filter(a => a.type === 'image').length || 0, icon: ImageIcon, id: 'image' },
    { label: 'Packs', count: 0, icon: Box, id: 'pack' },
  ];

  const filteredAssets = assets ? (activeFilter === 'All' 
    ? assets 
    : assets.filter(a => a.type === activeFilter)) : [];

  const renderBeatPacks = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {beatPacks?.map((pack: any) => (
            <div key={pack._id} className="bg-[#12121A] p-4 rounded-2xl border border-white/5 space-y-2">
                <Music2 className="w-8 h-8 text-purple-400" />
                <h3 className="font-bold text-sm truncate">{pack.title}</h3>
                <p className="text-xs text-white/50">BPM: {pack.bpm}</p>
            </div>
        ))}
    </div>
  );
  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAssetMutation({ id, userId: user?.uid || "" });
      } catch (err) {
        console.error('Failed to delete asset:', err);
      }
    }
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-transparent overflow-x-hidden">
      {/* Native-style Mobile Header */}
      <header className="sticky top-0 z-30 w-full bg-gradient-to-b from-[#05050D] to-[#05050D]/0 backdrop-blur-xl pt-safe group">
        <div className="h-16 px-4 md:px-8 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">Your Library</h1>
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-medium">Manage Generated Media</p>
          </div>
          <button 
             className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/20 flex items-center justify-center hover:bg-purple-600/40 transition-all active:scale-95 shadow-lg shadow-purple-500/10"
             onClick={() => alert('Fast Upload Feature Coming Soon')}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Inline Filters */}
        <div className="flex gap-2.5 px-4 md:px-8 py-4 overflow-x-auto hide-scrollbar items-center snap-x w-full">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeFilter === type.id;
            return (
              <button
                key={type.label}
                onClick={() => setActiveFilter(type.id)}
                className={`flex-shrink-0 h-9 relative flex items-center justify-center gap-2 px-4 rounded-xl whitespace-nowrap transition-all duration-300 text-xs font-bold border snap-start ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-sm' 
                    : 'bg-white/5 text-white/40 border-transparent hover:text-white hover:bg-white/10'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-white/40'}`} />}
                <span>{type.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md ml-0.5 ${isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-white/5 text-white/30'}`}>{type.count}</span>
              </button>
            )
          })}
          <div className="w-4 shrink-0" />
        </div>
      </header>

      <div className="flex-1 px-4 md:px-8 py-6 w-full">
        <div className="w-full mx-auto">
          {/* Grid Output */}
          {activeFilter === 'beatPack' ? (
              renderBeatPacks()
          ) : filteredAssets.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredAssets.map(asset => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, type: 'spring', damping: 25 }}
                    key={asset._id} 
                    className="group relative aspect-square bg-[#0A0A0F] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all shadow-xl"
                  >
                    {asset.type === 'audio' ? (
                      <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-[#1A1A24] to-[#05050A]">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                          <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
                        </div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Audio Track</p>
                        <Music2 className="absolute top-4 right-4 w-4 h-4 text-white/10" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                        <img 
                          src={asset.thumbnailUrl || asset.url} 
                          alt={asset.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 flex flex-col justify-end">
                       <div className="flex justify-between items-center">
                         <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-bold text-xs md:text-sm text-white truncate drop-shadow-md">{asset.title}</h3>
                            <p className="text-[10px] text-white/40 font-medium">{new Date(asset.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="relative">
                            <button 
                              onClick={() => setShowMenuId(showMenuId === asset._id ? null : asset._id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showMenuId === asset._id ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {showMenuId === asset._id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowMenuId(null)} />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute bottom-full right-0 mb-2 w-40 bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-1.5"
                                  >
                                    <button 
                                      onClick={() => { setSelectedAsset(asset); setShowMenuId(null); }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                      <Play className="w-3.5 h-3.5" /> Preview
                                    </button>
                                    <button 
                                      onClick={() => { handleDownload(asset.url, asset.title); setShowMenuId(null); }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                      <Download className="w-3.5 h-3.5" /> Download
                                    </button>
                                    <button 
                                      onClick={() => { window.open(asset.url, '_blank'); setShowMenuId(null); }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" /> Open URL
                                    </button>
                                    <div className="h-[1px] bg-white/5 my-1 mx-2" />
                                    <button 
                                      onClick={() => { handleDelete(asset._id); setShowMenuId(null); }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                         </div>
                       </div>
                    </div>

                    {asset.type === 'video' && (
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                        <Video className="w-2.5 h-2.5 text-purple-400" />
                        <span className="text-[9px] font-black tracking-tighter text-white">4K AI</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="w-full min-h-[400px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 bg-white/[0.01]">
              <div className="w-20 h-20 bg-purple-500/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FolderOpen className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="text-xl font-bold mb-2">No {activeFilter} media found</h3>
              <p className="text-sm text-white/30 max-w-xs mb-8">
                Your generated beats and visual assets will appear here automatically.
              </p>
              <button 
                onClick={() => setActiveFilter('All')} 
                className="px-8 py-3 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-gray-200 transition-all active:scale-95"
              >
                Refresh Library
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Asset Preview Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setSelectedAsset(null)} />
            
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-4xl h-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute -top-12 md:top-0 md:-right-12 text-white/40 hover:text-white p-2"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="w-full aspect-video md:aspect-auto md:flex-1 rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                {selectedAsset.type === 'video' ? (
                  <video src={selectedAsset.url} className="w-full h-full object-contain" controls autoPlay />
                ) : selectedAsset.type === 'image' ? (
                  <img src={selectedAsset.url} alt={selectedAsset.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#12121A] to-black">
                     <div className="w-32 h-32 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Music2 className="w-16 h-16 animate-pulse" />
                     </div>
                     <audio src={selectedAsset.url} controls className="w-full max-w-md accent-purple-500" />
                  </div>
                )}
              </div>

              <div className="mt-8 text-center max-w-2xl px-4">
                <h2 className="text-2xl font-bold mb-2">{selectedAsset.title}</h2>
                <div className="flex items-center justify-center gap-4 text-sm text-white/40">
                  <span className="uppercase tracking-widest font-black text-purple-500/60">{selectedAsset.type}</span>
                  <span>•</span>
                  <span>{new Date(selectedAsset.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
