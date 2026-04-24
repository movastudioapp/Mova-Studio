import { useState, useRef } from 'react';
import { UploadCloud, Layers, Play, Settings2, Sparkles, Wand2, Scissors, FastForward, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SEGMENTS = [
  { id: 1, type: 'Intro', duration: '0:15', color: 'from-[#B200FF] to-[#FF007F]', prompt: 'Neon city establishing shot', status: 'ready', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, type: 'Verse 1', duration: '0:30', color: 'from-[#00E5FF] to-[#B200FF]', prompt: 'Cyberpunk character walking', status: 'generating', video: null },
  { id: 3, type: 'Build', duration: '0:15', color: 'from-[#FF5E00] to-[#FF007F]', prompt: 'Energy gathering, fast cuts', status: 'pending', video: null },
  { id: 4, type: 'Drop', duration: '0:30', color: 'from-[#FF007F] to-[#00E5FF]', prompt: 'Massive explosion of light', status: 'pending', video: null },
];

export default function FullSongBuilder() {
  const [analyzing, setAnalyzing] = useState(false);
  const [songLoaded, setSongLoaded] = useState(false);
  const [activeSegment, setActiveSegment] = useState(1);
  const [isRendering, setIsRendering] = useState(false);

  // Local mutable state for segments to simulate generation
  const [segmentsData, setSegmentsData] = useState(SEGMENTS);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const simulateLoad = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setSongLoaded(true);
    }, 3000);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateLoad();
    }
  };

  const currentSegmentData = segmentsData.find(s => s.id === activeSegment);

  const simulateRender = () => {
    if (!currentSegmentData) return;
    setIsRendering(true);
    setSegmentsData(prev => prev.map(s => s.id === activeSegment ? { ...s, status: 'generating' } : s));
    setTimeout(() => {
      setIsRendering(false);
      setSegmentsData(prev => prev.map(s => s.id === activeSegment ? { 
        ...s, 
        status: 'ready', 
        video: 'https://www.w3schools.com/html/mov_bbb.mp4' 
      } : s));
    }, 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05050A]">
      {/* Top section: Preview & Settings */}
      <div className="flex-1 flex flex-col-reverse md:flex-row overflow-hidden bg-transparent">
        
        {/* Left: Current Segment Editor */}
        <div className="flex-1 md:flex-none w-full md:w-1/3 md:max-w-sm lg:w-[380px] p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto bg-black/40 md:bg-transparent backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 shrink-0">
          {!songLoaded ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Layers className="w-8 h-8 text-[#FF5E00]" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Song Video Builder</h2>
              <p className="text-gray-400 mb-8 max-w-xs">Upload a full track. AI will analyze the structure and generate scenes for each segment.</p>
              
              <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleFileUpload} />
              <button 
                onClick={() => audioInputRef.current?.click()}
                disabled={analyzing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF5E00] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(255,94,0,0.4)] transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing BPM & Drops...</> : <><UploadCloud className="w-5 h-5" /> Upload Audio Track</>}
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full gap-4">
               <div className="flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                 <div>
                   <span className="text-[#FF5E00] font-bold text-[10px] uppercase tracking-widest bg-[#FF5E00]/10 px-2 py-1 rounded-md mb-1 inline-block">124 BPM</span>
                   <h3 className="font-display font-bold text-lg">Segment Editor</h3>
                 </div>
                 <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><Settings2 className="w-5 h-5" /></button>
               </div>
               
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    <span>Scene Prompt</span>
                    <span className="text-[#00E5FF]">{currentSegmentData?.type}</span>
                  </div>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FF5E00] transition-colors resize-none h-20"
                    key={activeSegment}
                    defaultValue={currentSegmentData?.prompt}
                  />
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">Regenerate</button>
                    <button 
                      onClick={simulateRender}
                      disabled={isRendering || currentSegmentData?.status === 'ready'}
                      className="flex-[2] py-3 bg-gradient-to-r from-[#FF5E00] to-[#FF007F] text-white rounded-xl text-xs font-bold hover:shadow-[0_0_15px_rgba(255,94,0,0.4)] transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isRendering ? <Loader2 className="w-4 h-4 animate-spin" /> : currentSegmentData?.status === 'ready' ? 'Completed' : <><Sparkles className="w-4 h-4" /> Render Clip</>}
                    </button>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-4 mt-auto">
                 <h4 className="font-bold text-xs uppercase tracking-wider mb-3">AI Transition (Out)</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/30 rounded-xl text-[10px] uppercase tracking-wider font-bold">Beat Sync Cut</button>
                    <button className="py-2.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent rounded-xl text-[10px] uppercase tracking-wider font-bold">Morph Fusion</button>
                    <button className="py-2.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent rounded-xl text-[10px] uppercase tracking-wider font-bold">Glitch Shift</button>
                    <button className="py-2.5 bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent rounded-xl text-[10px] uppercase tracking-wider font-bold">Crossfade</button>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Right: Main Preview Container */}
        <div className="min-h-[240px] md:min-h-0 shrink-0 md:flex-1 w-full p-4 md:p-6 bg-black/40 flex flex-col items-center justify-center relative">
             <div className="w-full h-full max-w-3xl aspect-video md:aspect-auto bg-[#05050A] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                {!songLoaded ? (
                  <Play className="w-16 h-16 text-white/20" />
                ) : (
                  <AnimatePresence mode="wait">
                    {currentSegmentData?.status === 'generating' || isRendering ? (
                      <motion.div 
                         key="rendering"
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="absolute inset-0 bg-gradient-to-tr from-[#1a0033] to-[#001a33] flex items-center justify-center"
                      >
                         <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                             <span className="font-display font-bold text-white/50 text-xl md:text-2xl">Rendering {currentSegmentData?.type}...</span>
                         </motion.div>
                      </motion.div>
                    ) : currentSegmentData?.status === 'ready' && currentSegmentData.video ? (
                      <motion.div 
                         key="ready"
                         initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                         className="absolute inset-0 w-full h-full group"
                      >
                         <video 
                           src={currentSegmentData.video}
                           autoPlay 
                           loop 
                           muted 
                           playsInline
                           className="w-full h-full object-cover"
                         />
                         {/* Playhead overlay indication */}
                         <div className="absolute inset-0 border-[4px] border-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                      </motion.div>
                    ) : (
                      <motion.div 
                         key="pending"
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="absolute inset-0 flex flex-col items-center justify-center text-white/30"
                      >
                         <Play className="w-12 h-12 mb-4 opacity-50 text-white" />
                         <span className="font-medium">Ready to Render Segment</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
             </div>
        </div>
      </div>

      {/* Timeline Editor (Bottom) */}
      <div className={`h-[140px] md:h-48 shrink-0 border-t border-white/10 bg-[#0A0A0F] p-4 flex flex-col transition-opacity duration-500 max-h-[30vh] overflow-hidden ${songLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Timeline Editor</h3>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hidden md:flex"><Scissors className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hidden md:flex"><Wand2 className="w-4 h-4" /></button>
              <button className="p-1.5 bg-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF]/30 rounded-lg border border-[#00E5FF]/30 px-3 font-bold text-xs flex items-center gap-1 transition-colors">
                <Download className="w-3 h-3 hidden md:block" /> Export <span className="hidden md:inline">Full Video</span> <FastForward className="w-3 h-3" />
              </button>
            </div>
         </div>
         
         <div className="flex-1 bg-black/50 rounded-xl border border-white/10 relative overflow-x-auto overflow-y-hidden hide-scrollbar flex items-center px-4 py-2 scroll-smooth">
             {/* Dynamic Playhead */}
             {songLoaded && (
               <div className="absolute top-0 bottom-0 w-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] z-20 flex items-center justify-center hover:cursor-col-resize animate-[marquee_15s_linear_infinite]">
                  <div className="w-3 h-3 bg-[#00E5FF] rounded-full absolute -top-1" />
               </div>
             )}

             <div className="flex h-full min-w-max gap-1 pb-1">
                {segmentsData.map((seg) => (
                  <button 
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`h-full relative rounded-lg border-2 overflow-hidden transition-all duration-300 flex flex-col justify-end p-2 ${
                      activeSegment === seg.id ? `border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] w-40 md:w-60` : `border-transparent opacity-70 w-28 md:w-40 hover:opacity-100`
                    }`}
                  >
                     <div className={`absolute inset-0 bg-gradient-to-r ${seg.color} opacity-40`} />
                     {(seg.status === 'generating' || (activeSegment === seg.id && isRendering)) && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                           <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-white mb-1" />
                           <span className="text-[8px] uppercase tracking-widest text-white/80 font-bold">Rendering</span>
                        </div>
                     )}
                     {seg.status === 'ready' && !(activeSegment === seg.id && isRendering) && (
                        <div className="absolute top-2 right-2 flex items-center justify-center z-10 w-4 h-4 bg-green-500/80 rounded-full border border-green-300">
                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                     )}
                     <div className="relative z-10 font-bold text-xs md:text-sm text-white drop-shadow-md truncate">{seg.type}</div>
                     <div className="relative z-10 text-[10px] md:text-xs text-white/70 font-mono drop-shadow-md">{seg.duration}</div>
                  </button>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
