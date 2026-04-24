import { useState, useRef } from 'react';
import { UploadCloud, Wand2, Loader2, Music2, Camera, Sparkles, Download, Maximize2, Share2, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BeatImageFusion() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedVideo(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
    }, 4500); // Complex fusion takes longer
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadedAudio(e.target.files[0]);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadedImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="w-full h-full flex flex-col-reverse md:flex-row bg-transparent overflow-hidden">
      <div className="flex-1 md:flex-none w-full md:w-1/2 lg:w-2/5 p-5 md:p-6 pb-20 flex flex-col gap-8 overflow-y-auto bg-black/40 md:bg-transparent backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 shrink-0">
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">1. Audio / Beat</label>
             <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleAudioChange} />
             <div 
               onClick={() => audioInputRef.current?.click()}
               className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group h-32 transition-colors ${uploadedAudio ? 'border-[#FF5E00] bg-[#FF5E00]/10' : 'border-white/20 hover:border-[#FF5E00] bg-black/20'}`}
             >
                {uploadedAudio ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-[#FF5E00] mb-2" />
                    <p className="text-[10px] font-semibold text-[#FF5E00] px-2 truncate w-full">{uploadedAudio.name}</p>
                  </>
                ) : (
                  <>
                    <Music2 className="w-6 h-6 text-gray-400 group-hover:text-[#FF5E00] mb-2 transition-colors" />
                    <p className="text-xs font-semibold">Upload Beat</p>
                  </>
                )}
             </div>
           </div>
           
           <div>
             <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">2. Base Image</label>
             <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
             <div 
               onClick={() => imageInputRef.current?.click()}
               className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group h-32 overflow-hidden relative transition-colors ${uploadedImage ? 'border-[#B200FF] bg-transparent' : 'border-white/20 hover:border-[#B200FF] bg-black/20'}`}
             >
                {uploadedImage ? (
                  <>
                    <img src={uploadedImage} alt="Uploaded Base" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-white drop-shadow-md">Change</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#B200FF] mb-2 transition-colors" />
                    <p className="text-xs font-semibold">Upload Image</p>
                  </>
                )}
             </div>
           </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">Fusion Intensity</label>
          <input type="range" className="w-full accent-[#FF007F]" min="0" max="100" defaultValue="75" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
             <span>Subtle Sync</span>
             <span>Aggressive Beat Drops</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#FF5E00]/10 to-[#B200FF]/10 border border-white/10 rounded-xl p-4">
           <h4 className="font-bold text-sm mb-2 text-white flex items-center gap-2"><Wand2 className="w-4 h-4 text-[#FF007F]" /> Fusion Engine</h4>
           <p className="text-xs text-gray-400 leading-relaxed">
             The AI will map the skeleton from your image to a dance cycle that matches the exact BPM and rhythm transients of your uploaded audio.
           </p>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedAudio || !uploadedImage}
          className="mt-auto w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5E00] to-[#B200FF] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(255,94,0,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Fusing Elements...</> : <><Sparkles className="w-5 h-5" /> Execute Fusion</>}
        </button>
      </div>

      <div className="min-h-[280px] md:min-h-0 shrink-0 md:flex-1 w-full p-4 md:p-6 bg-black/40 flex flex-col items-center justify-center relative">
         {/* Particles background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FF5E00] rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#B200FF] rounded-full blur-[100px]" />
         </div>

         <div className="w-full max-w-sm aspect-[9/16] bg-[#05050A] rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl z-10">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                 <motion.div 
                   key="generating"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="flex flex-col items-center p-6 text-center absolute inset-0 justify-center bg-black/50 backdrop-blur-sm z-10"
                 >
                    <motion.div className="flex gap-4 mb-6">
                       <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity }} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-[#FF5E00]/50"><Music2 className="w-5 h-5 text-[#FF5E00]" /></motion.div>
                       <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-6 flex items-center justify-center"><Wand2 className="w-4 h-4 text-[#FF007F]" /></motion.div>
                       <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-[#B200FF]/50"><Camera className="w-5 h-5 text-[#B200FF]" /></motion.div>
                    </motion.div>
                    <h3 className="font-bold font-display text-lg">Syncing frames to beats...</h3>
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
                  
                  {/* Overlay actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity pb-8">
                    <div className="flex flex-col">
                      <div className="px-2 py-1 bg-[#FF007F]/80 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-tighter self-start mb-2">Fusion Complete</div>
                      <h3 className="font-bold text-white shadow-black drop-shadow-md">Neon Rhythm</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/10">
                         <Play className="w-4 h-4 text-white ml-1" />
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
                    className="text-center text-white/30 flex flex-col items-center justify-center absolute inset-0"
                  >
                     <Wand2 className="w-12 h-12 mb-4 opacity-50 mx-auto text-[#FF007F]" />
                     <p className="font-medium">Fusion Preview</p>
                  </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}


