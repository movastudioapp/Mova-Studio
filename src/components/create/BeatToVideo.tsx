import { useState, useRef } from 'react';
import { UploadCloud, Play, Settings2, Sparkles, Loader2, Download, Maximize2, Share2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STYLES = ['Cinematic', 'Dance AI', 'Anime', 'Cyberpunk', 'Realistic', 'Abstract'];

export default function BeatToVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedVideo(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
    }, 4000); // Simulate API call
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       setUploadedAudio(e.target.files[0]);
     }
  };

  return (
    <div className="w-full h-full flex flex-col-reverse md:flex-row bg-transparent overflow-hidden">
      {/* Left Panel: Inputs */}
      <div className="flex-1 md:flex-none w-full md:w-[320px] lg:w-[380px] p-5 md:p-6 pb-20 flex flex-col gap-8 overflow-y-auto bg-black/40 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/5 shrink-0">
        
        {/* Audio Upload */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3 block">Audio Source</label>
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group ${uploadedAudio ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50 bg-white/5'}`}
          >
            {uploadedAudio ? (
               <>
                 <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                   <CheckCircle2 className="w-6 h-6 text-purple-400" />
                 </div>
                 <p className="font-semibold text-sm text-purple-200">Audio Selected</p>
                 <p className="text-xs text-purple-400/80 mt-1 truncate max-w-full px-4">{uploadedAudio.name}</p>
               </>
            ) : (
               <>
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                   <UploadCloud className="w-6 h-6 text-white/40 group-hover:text-purple-400" />
                 </div>
                 <p className="font-semibold text-sm">Upload Beat or Audio</p>
                 <p className="text-xs text-white/40 mt-1">MP3, WAV up to 10MB</p>
               </>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3 block">Scene Description</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-purple-500/50 transition-colors resize-none h-24"
            placeholder="Describe the visual scene to match the beat..."
          />
        </div>

        {/* Style Selector */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3 block">Visual Style</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                  selectedStyle === style
                    ? 'bg-purple-500/20 border border-purple-500/50 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                }`}
              >
                {selectedStyle === style && <div className="w-2 h-2 rounded bg-purple-400"></div>}
                {style}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedAudio}
          className="mt-auto md:mt-4 w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_15px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Rendering Scene...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Generate Video</span>
            </>
          )}
        </button>
      </div>

      {/* Right Panel: Preview & Waveform */}
      <div className="min-h-[280px] md:min-h-0 shrink-0 md:flex-1 w-full p-4 md:p-6 bg-transparent flex flex-col overflow-hidden gap-4 md:gap-6">
        {/* Main Preview Area */}
        <div className="flex-1 bg-black rounded-2xl relative overflow-hidden group border border-white/5 shadow-2xl flex flex-col justify-end">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/80 backdrop-blur-sm z-20"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mb-6 rounded-full border-t-2 border-r-2 border-purple-500"
                />
                <h3 className="text-xl font-bold mb-2">Analyzing audio structure...</h3>
                <p className="text-white/60 text-sm max-w-sm">deAPI is synchronizing your prompt with the detected BPM and rhythm markers.</p>
              </motion.div>
            ) : generatedVideo ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 w-full h-full group"
              >
                <video 
                  src={generatedVideo}
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] uppercase font-bold tracking-tighter">4K Ultra HD</div>
                  <div className="px-3 py-1 bg-purple-500/80 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-tighter">AI Active</div>
                </div>
                
                {/* Overlay actions */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent flex flex-col md:flex-row gap-4 justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div>
                     <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter drop-shadow-md">New Project</h2>
                     <p className="text-white/80 text-sm drop-shadow-md">Synced to {selectedStyle} visuals</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                       <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                       <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                       <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-white/40"
              >
                <Play className="w-12 h-12 mb-4 opacity-50" />
                <p>Preview will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform Panel */}
        <div className="h-40 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
           <div className="flex justify-between items-center px-2">
             <div className="flex gap-4 items-center">
               <span className="text-[10px] font-mono text-purple-400">{generatedVideo ? '00:03:14 / 00:03:14' : '00:00:00 / 00:00:00'}</span>
               <div className="h-px w-24 bg-white/20"></div>
               <span className="text-[10px] text-white/40 uppercase tracking-widest hidden md:inline">Beat Markers</span>
             </div>
             <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
               <Settings2 className="w-3 h-3" /> Advanced
             </button>
           </div>
           
           <div className="flex-1 flex gap-1 items-end px-2 relative">
              {/* Simulated waveform bars */}
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: isGenerating ? [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`] : generatedVideo ? `${Math.random() * 60 + 20}%` : '10%' }}
                  transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                  className={`flex-1 w-1 rounded-t-sm ${i % 5 === 0 && generatedVideo ? 'bg-pink-500' : 'bg-purple-500/40'}`}
                  style={{ height: generatedVideo ? `${Math.random() * 80 + 10}%` : '10%' }}
                />
              ))}
              {generatedVideo && <div className="absolute top-0 bottom-0 w-px bg-[#00E5FF] left-0 shadow-[0_0_10px_#00E5FF] animate-[marquee_10s_linear_infinite]" />}
           </div>

           {/* Progress Line */}
           <div className="absolute top-10 bottom-0 w-px bg-white/50 left-[20%] hidden md:block" />
        </div>
      </div>
    </div>
  );
}
