import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Layers, Play, Settings2, Sparkles, Wand2, Scissors, FastForward, Loader2, Download, Music2, CheckCircle2, ChevronRight, LayoutPanelTop, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_SEGMENTS = [
  { id: 1, type: 'Intro', duration: '0:15', color: 'from-[#B200FF] to-[#FF007F]', prompt: 'Neon city establishing shot', status: 'ready', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, type: 'Verse 1', duration: '0:30', color: 'from-[#00E5FF] to-[#B200FF]', prompt: 'Cyberpunk character walking', status: 'generating', video: null },
  { id: 3, type: 'Build', duration: '0:15', color: 'from-[#FF5E00] to-[#FF007F]', prompt: 'Energy gathering, fast cuts', status: 'pending', video: null },
  { id: 4, type: 'Drop', duration: '0:30', color: 'from-[#FF007F] to-[#00E5FF]', prompt: 'Massive explosion of light', status: 'pending', video: null },
];

export default function FullSongBuilder() {
  const [activeStep, setActiveStep] = useState<'upload' | 'build' | 'preview'>('upload');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSegment, setActiveSegment] = useState(1);
  const [isRendering, setIsRendering] = useState(false);
  const [segmentsData, setSegmentsData] = useState(INITIAL_SEGMENTS);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Direct transition to build step
      setActiveStep('build');
    }
  };

  const currentSegmentData = segmentsData.find(s => s.id === activeSegment);

  const handleRenderSegment = () => {
    if (!currentSegmentData) return;
    setIsRendering(true);
    setSegmentsData(prev => prev.map(s => s.id === activeSegment ? { 
      ...s, 
      status: 'ready', 
      video: 'https://www.w3schools.com/html/mov_bbb.mp4' 
    } : s));
    setIsRendering(false);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-transparent relative overflow-hidden">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#05050D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex gap-1.5 items-center">
            <div className={`h-1 rounded-full ${activeStep === 'upload' ? 'w-4 bg-[#FF5E00]' : 'w-1 bg-white/10'}`} />
            <div className={`h-1 rounded-full ${activeStep === 'build' ? 'w-4 bg-[#FF5E00]' : 'w-1 bg-white/10'}`} />
            <div className={`h-1 rounded-full ${activeStep === 'preview' ? 'w-4 bg-[#FF5E00]' : 'w-1 bg-white/10'}`} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            {activeStep === 'upload' ? 'Sync 01' : activeStep === 'build' ? 'Sync 02' : 'Sync 03'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 'upload' ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Music2 className="w-8 h-8 text-[#FF5E00]" />
            </div>
            <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white mb-2">Song Master</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Upload your track. Audio transients mapping.</p>
            
            <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleFileUpload} />
            <button 
              onClick={() => audioInputRef.current?.click()}
              disabled={analyzing}
              className="w-full max-w-xs py-4 rounded-full bg-gradient-to-r from-[#FF007F] via-[#FF5E00] to-[#FF007F] text-white font-semibold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(255,94,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Transcribing...</> : <><UploadCloud className="w-5 h-5" /> Load Audio</>}
            </button>
          </motion.div>
        ) : activeStep === 'build' ? (
          <motion.div 
            key="build"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
             {/* Header */}
             <div className="hidden md:flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-[#FF5E00]/20 text-[#FF5E00] font-black text-[10px] uppercase rounded-full">124 BPM</div>
                    <h3 className="text-sm font-semibold uppercase text-white">Timeline</h3>
                </div>
                <button 
                  onClick={() => setActiveStep('preview')}
                  className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-semibold uppercase text-white/60 hover:text-white transition-all flex items-center gap-2"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
             </div>

             {/* Main Editor Body */}
             <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Editor Panel */}
                <div className="flex-1 md:w-[400px] p-6 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-8 hide-scrollbar">
                        {/* Editor Controls Grid (Scene Description + Transition Morph) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Scene Description */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#00E5FF] mb-3 block">Scene Description</label>
                                <textarea 
                                    className="flex-1 bg-white/5 rounded-xl p-4 text-xs font-medium text-white focus:outline-none focus:border-[#FF5E00] transition-colors resize-none h-40"
                                    key={activeSegment}
                                    defaultValue={currentSegmentData?.prompt}
                                />
                                <div className="flex gap-3 mt-4">
                                    <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-semibold uppercase text-white/50 hover:bg-white/10 hover:text-white transition-all">Re-Gen</button>
                                    <button 
                                        onClick={handleRenderSegment}
                                        disabled={isRendering || currentSegmentData?.status === 'ready'}
                                        className="flex-[2] py-3 bg-gradient-to-r from-[#FF5E00] to-[#FF007F] text-white rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,94,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isRendering ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4" />} Render Node
                                    </button>
                                </div>
                            </div>

                            {/* Transition FX */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#00E5FF] mb-3 block">Transition Morph</label>
                                 <div className="grid grid-cols-2 gap-3 flex-1">
                                 {['Beat Drop', 'Fluid Pan', 'Glitch Out', 'Dissolve'].map((fx, i) => (
                                         <button 
                                             key={fx} 
                                             className={`py-5 px-4 rounded-xl border-0 ${i % 2 === 0 ? 'bg-gradient-to-br from-[#FF5E00]/80 to-[#FF5E00]/40' : 'bg-gradient-to-br from-[#00E5FF]/80 to-[#00E5FF]/40'} text-[11px] font-semibold uppercase tracking-wider text-white hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white`}
                                             aria-label={`Select transition morph ${fx}`}
                                         >
                                            {fx}
                                         </button>
                                     ))}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-[#00E5FF] mb-3 block">Timeline</label>
                            <div className="flex items-center gap-3 h-20 bg-black/40 rounded-2xl p-2 w-full overflow-x-auto hide-scrollbar">
                                {segmentsData.map(seg => (
                                    <button 
                                        key={seg.id}
                                        onClick={() => setActiveSegment(seg.id)}
                                        className={`h-full min-w-[100px] rounded-lg relative overflow-hidden transition-all flex flex-col items-center justify-center p-2 text-center ${activeSegment === seg.id ? 'bg-[#FF5E00]/20 ring-1 ring-[#FF5E00]' : 'bg-white/5 opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className="text-[9px] font-semibold uppercase tracking-tighter text-white truncate">{seg.type}</div>
                                        <div className="text-[7px] text-white/50">{seg.duration}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Finalize button */}
                    <div className="shrink-0 pt-6">
                        <button 
                            onClick={() => setActiveStep('preview')}
                            className="w-full py-4 rounded-xl bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-[#00E5FF] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                             Finalize Project
                        </button>
                    </div>
                </div>

                {/* Right: Desktop Live Preview */}
                <div className="hidden md:flex flex-1 p-4 items-center justify-center">
                    <div className="w-full max-w-2xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                         <AnimatePresence mode="wait">
                            {isRendering ? (
                                <motion.div 
                                    key="rendering"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
                                >
                                    <h3 className="text-xl font-semibold uppercase tracking-tighter text-white/20 animate-pulse">Encoding...</h3>
                                </motion.div>
                            ) : currentSegmentData?.status === 'ready' ? (
                                <video src={currentSegmentData.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-white/10">
                                    <Play className="w-12 h-12 mb-4 opacity-5" />
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em]">Awaiting Render</p>
                                </div>
                            )}
                         </AnimatePresence>
                    </div>
                </div>
             </div>
          </motion.div>
        ) : (
            <motion.div 
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-6 h-full overflow-y-auto gap-4 items-center hide-scrollbar"
          >
             <div className="flex items-center justify-between w-full md:hidden">
                <button onClick={() => setActiveStep('build')} className="p-2 -ml-2 text-white/60"><Settings2 className="w-5 h-5" /></button>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5E00]">Final Cut</h3>
                <div className="w-8" />
             </div>

             <div className="w-full max-w-3xl flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl relative mb-2">
                 <video src="https://www.w3schools.com/html/mov_bbb.mp4" autoPlay loop className="w-full h-full object-cover" />
                 
                 <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                     <h3 className="text-lg font-semibold text-white uppercase tracking-tighter drop-shadow-2xl">Cyberheart Transients</h3>
                 </div>
             </div>

             <div className="flex gap-2 w-full max-w-sm">
                <button className="flex-1 py-3 rounded-2xl bg-white text-black font-semibold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    <Download className="w-4 h-4" /> Export 4K
                </button>
                <button onClick={() => setActiveStep('build')} className="px-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
                    <Settings2 className="w-5 h-5" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
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
