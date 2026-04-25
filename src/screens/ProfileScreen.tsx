import { useState } from 'react';
import { Settings, Grid, Heart, Music2, Share2, Play, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/auth/AuthProvider';
import { logout } from '../lib/firebase';

const DUMMY_CREATIONS = [
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80',
];

export default function ProfileScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'creations' | 'likes' | 'beats'>('creations');

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent">
      {/* Cover Photo - Dynamic height on mobile */}
      <div className="h-40 md:h-64 w-full bg-gradient-to-br from-[#B200FF] via-[#00E5FF] to-[#FF007F] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Top Actions - Floating native look */}
        <div className="absolute top-safe left-0 w-full px-4 md:px-8 py-4 flex justify-between items-center z-20">
          <div className="md:hidden">
            <h2 className="text-white font-black tracking-tighter text-lg bg-black/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 uppercase">Profile</h2>
          </div>
          <div className="flex gap-2 ml-auto">
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 flex items-center justify-center transition-all active:scale-90"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center transition-all active:scale-95">
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shadow-2xl">
        <div className="relative -mt-12 md:-mt-20 mb-8 flex flex-col md:flex-row md:items-end gap-5">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] border-4 border-[#05050D] overflow-hidden bg-gray-900 shadow-2xl relative z-10 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{user.displayName || 'Creator'}</h1>
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center p-1 border border-white/20">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-purple-400 font-bold text-sm tracking-wide mt-0.5">@{user.email?.split('@')[0] || 'mova_creator'}</p>
            <p className="mt-3 text-xs md:text-sm max-w-md text-white/50 font-medium leading-relaxed">AI Director & Sound Architect. Exploring the intersection of generative motion and neural beats.</p>
          </div>

          <div className="flex gap-2.5 pb-2 shrink-0 md:mb-1">
            <button className="h-10 px-6 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
              Edit Studio
            </button>
            <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Stats - Bento Style */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center group hover:bg-white/[0.05] transition-colors">
            <div className="text-xl md:text-2xl font-black text-white group-hover:text-purple-400 transition-colors">142</div>
            <div className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">Scenes</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center group hover:bg-white/[0.05] transition-colors">
            <div className="text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors">38</div>
            <div className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">Compositions</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center group hover:bg-white/[0.05] transition-colors">
            <div className="text-xl md:text-2xl font-black text-white group-hover:text-pink-400 transition-colors">12.4K</div>
            <div className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">Impact</div>
          </div>
        </div>

        {/* Content Tabs - Native Segmented Control UI */}
        <div className="sticky top-0 z-30 bg-[#05050D]/80 backdrop-blur-xl py-4 mx-[-1rem] px-4 md:mx-0 md:px-0">
          <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-2xl relative shadow-inner">
            <div 
               className="absolute top-1 bottom-1 bg-white/10 rounded-xl shadow-lg border border-white/10 transition-all duration-500 ease-out"
               style={{ 
                 width: 'calc(33.33% - 2px)',
                 transform: `translateX(${activeTab === 'creations' ? '0' : activeTab === 'likes' ? 'calc(100% + 2px)' : 'calc(200% + 4px)'})`
               }} 
            />
            <button 
              onClick={() => setActiveTab('creations')} 
              className={`flex-1 py-2.5 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest relative z-10 transition-colors ${activeTab === 'creations' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Creations</span>
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest relative z-10 transition-colors ${activeTab === 'likes' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Likes</span>
            </button>
            <button 
              onClick={() => setActiveTab('beats')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest relative z-10 transition-colors ${activeTab === 'beats' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Beats</span>
            </button>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 pb-10 md:pb-20 mt-4 transition-all pb-nav-safe">
          <AnimatePresence mode="popLayout">
            {activeTab === 'creations' && DUMMY_CREATIONS.map((img, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={`creation-${i}`} 
                className="aspect-[3/4] bg-white/5 rounded-xl md:rounded-3xl relative group overflow-hidden cursor-pointer border border-white/5 shadow-lg"
              >
                <img src={img} alt="Creation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition duration-300 shadow-2xl">
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
                className="aspect-[3/4] bg-white/5 rounded-xl md:rounded-3xl relative group overflow-hidden cursor-pointer border border-white/5 shadow-lg"
              >
                <img src={img} alt="Like" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                     <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#FF007F] fill-[#FF007F] filter drop-shadow-lg" />
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition duration-300 shadow-2xl">
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
                className="aspect-[3/4] bg-gradient-to-br from-[#1A1A24] to-[#05050A] rounded-xl md:rounded-3xl relative group overflow-hidden cursor-pointer border border-white/5 flex flex-col justify-center items-center shadow-lg"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-inner">
                  <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" />
                </div>
                <h4 className="font-bold text-white text-xs md:text-sm tracking-tight">Audio Fragment {i + 1}</h4>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-black">AI Generated</p>
                
                <div className="absolute bottom-4 flex gap-1 opacity-20">
                  <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                  <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
