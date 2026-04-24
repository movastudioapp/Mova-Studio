import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioWaveform, Layers, Camera, Wand2, Type } from 'lucide-react';

import BeatToVideo from '../components/create/BeatToVideo';
import FullSongBuilder from '../components/create/FullSongBuilder';
import ImageToMotion from '../components/create/ImageToMotion';
import BeatImageFusion from '../components/create/BeatImageFusion';
import TextToImage from '../components/create/TextToImage';

type CreateMode = 'beat-video' | 'full-song' | 'image-motion' | 'fusion' | 'text-image';

export default function CreateScreen() {
  const [activeMode, setActiveMode] = useState<CreateMode>('beat-video');

  const modes = [
    { id: 'beat-video', label: 'Beat → Video', icon: AudioWaveform, color: 'from-[#B200FF] to-[#00E5FF]' },
    { id: 'full-song', label: 'Song Builder', icon: Layers, color: 'from-[#FF007F] to-[#FF5E00]' },
    { id: 'image-motion', label: 'Image → Motion', icon: Camera, color: 'from-[#00E5FF] to-[#B200FF]' },
    { id: 'fusion', label: 'Fusion', icon: Wand2, color: 'from-[#FF5E00] to-[#B200FF]' },
    { id: 'text-image', label: 'Text → Image', icon: Type, color: 'from-[#B200FF] to-[#FF007F]' },
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden z-10 relative">
      <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold tracking-tight text-white/90">
            MOVA STUDIO <span className="text-white/30 font-normal px-2">/</span> <span className="text-purple-400">Create Mode</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Status</p>
            <p className="text-xs font-mono text-emerald-400">SYSTEM READY</p>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex flex-col pb-0 min-h-0 overflow-hidden">
        {/* Mode Selector */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 py-4 flex-shrink-0 bg-black/20 border-b border-white/5 backdrop-blur-md z-10 w-full snap-x">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-[13px] font-bold border snap-start ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]' 
                    : 'bg-white/5 text-white/40 border-transparent hover:text-white/80 hover:bg-white/10'
                }`}
              >
                {isActive && <div className="absolute inset-0 rounded-full bg-purple-500/10"></div>}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-purple-400' : 'text-white/60'}`} />
                <span className="relative z-10 tracking-wide">{mode.label}</span>
              </button>
            )
          })}
          {/* Spacer to allow scrolling past the end on mobile */}
          <div className="w-4 shrink-0 md:hidden" />
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex"
            >
              {renderMode()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
