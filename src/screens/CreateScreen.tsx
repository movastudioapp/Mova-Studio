import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioWaveform, Layers, Camera, Wand2, Type, ArrowLeft } from 'lucide-react';
import BeatToVideo from '../components/create/BeatToVideo';
import FullSongBuilder from '../components/create/FullSongBuilder';
import ImageToMotion from '../components/create/ImageToMotion';
import BeatImageFusion from '../components/create/BeatImageFusion';
import TextToImage from '../components/create/TextToImage';

export default function CreateScreen() {
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const modes = [
    { id: 'beat-video', label: 'Beat → Video', icon: AudioWaveform, color: 'from-[#B200FF] to-[#00E5FF]', description: 'Transform audio rhythms into cinematic AI video motions.' },
    { id: 'full-song', label: 'Song Builder', icon: Layers, color: 'from-[#FF007F] to-[#FF5E00]', description: 'Arrange multiple generated clips into a full AI music video.' },
    { id: 'image-motion', label: 'Image → Motion', icon: Camera, color: 'from-[#00E5FF] to-[#B200FF]', description: 'Breathe life into static pixels with neural animation.' },
    { id: 'fusion', label: 'Fusion', icon: Wand2, color: 'from-[#FF5E00] to-[#B200FF]', description: 'Harmonize your tracks with perfectly synced visual energy.' },
    { id: 'text-image', label: 'Text → Image', icon: Type, color: 'from-[#B200FF] to-[#FF007F]', description: 'Generate high-fidelity concept art from text descriptions.' },
  ] as const;

  const renderMode = () => {
    switch (activeMode) {
      case 'beat-video': return <BeatToVideo />;
      case 'full-song': return <FullSongBuilder />;
      case 'image-motion': return <ImageToMotion />;
      case 'fusion': return <BeatImageFusion />;
      case 'text-image': return <TextToImage />;
      default: return null;
    }
  };

  const currentModeData = modes.find(m => m.id === activeMode);

  return (
    <div className="w-full min-h-full flex flex-col z-10 relative overflow-x-hidden">
      <header className="sticky top-0 z-30 w-full bg-gradient-to-b from-[#05050D] to-[#05050D]/0 backdrop-blur-xl pt-safe">
        <div className="h-16 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {activeMode && (
               <button 
                onClick={() => setActiveMode(null)}
                className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center"
               >
                 <ArrowLeft className="w-4 h-4" />
               </button>
             )}
             <div className="flex flex-col">
               <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                 {activeMode ? currentModeData?.label : 'STUDIO'}
               </h1>
               <p className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold">
                 {activeMode ? 'Creative Workspace' : 'AI Creative Suite'}
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Status</p>
                <p className="text-xs font-mono text-emerald-400">READY</p>
             </div>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex flex-col pb-0 min-h-0">
        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div 
              key="selection-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-3 md:px-8 py-5 grid grid-cols-2 lg:grid-cols-3 gap-3"
            >
              <div className="col-span-full mb-1">
                <h2 className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.3em]">Select Creation Tool</h2>
              </div>
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className="group relative flex flex-col items-start p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all text-left overflow-hidden min-h-[140px] md:min-h-0"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors" />
                    
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    
                    <h3 className="text-sm md:text-lg font-semibold text-white mb-1 leading-tight">{mode.label}</h3>
                    <p className="hidden md:block text-xs text-white/40 leading-relaxed font-medium">
                      {mode.description}
                    </p>
                    
                    <div className="mt-auto md:mt-6 flex items-center gap-2 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-purple-400 opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-[-10px] md:group-hover:translate-x-0">
                      Open <div className="w-3 md:w-4 h-[1px] bg-purple-500/50" />
                    </div>
                  </button>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0 w-full"
            >
              {renderMode()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
