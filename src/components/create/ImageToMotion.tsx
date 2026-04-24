import { useState, useRef } from 'react';
import { UploadCloud, Sparkles, Loader2, Play, Download, Maximize2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageToMotion() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState('Hip Hop');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedVideo(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      if (generatedVideo) setGeneratedVideo(null);
    }
  };

  const cycles = ['Hip Hop', 'Fluid Float', 'Combat Idle', 'Slow Pan'];

  return (
    <div className="w-full h-full flex flex-col-reverse md:flex-row bg-transparent overflow-hidden">
      <div className="flex-1 md:flex-none w-full md:w-1/2 lg:w-2/5 p-5 md:p-6 pb-20 flex flex-col gap-8 overflow-y-auto bg-black/40 md:bg-transparent backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 shrink-0">
        <div>
          <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">Source Image</label>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-[#B200FF] transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-black/20 cursor-pointer group"
          >
            {uploadedImage ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={uploadedImage} alt="Uploaded Base" className="max-h-full max-w-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-xs font-bold text-white">Change Image</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#B200FF]/10 transition-colors">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#B200FF]" />
                </div>
                <p className="font-semibold text-sm">Upload Static Image</p>
                <p className="text-xs text-gray-500 mt-1">Pose detection works best with full body shots</p>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">Motion Cycle</label>
          <div className="grid grid-cols-2 gap-2">
            {cycles.map(cycle => (
              <button 
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  activeCycle === cycle 
                    ? 'bg-[#00E5FF]/20 border border-[#00E5FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedImage}
          className="mt-auto w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#B200FF] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Animating Pixels...</> : <><Sparkles className="w-5 h-5" /> Generate Motion</>}
        </button>
      </div>

      <div className="min-h-[280px] md:min-h-0 shrink-0 md:flex-1 w-full p-4 md:p-6 bg-black/40 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm aspect-[3/4] bg-[#05050A] rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center p-6 text-center absolute inset-0 justify-center bg-black/50 backdrop-blur-sm z-10"
              >
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-2 border-dashed border-[#00E5FF] rounded-full mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#B200FF]/50 rounded-full" />
                 </motion.div>
                 <h3 className="font-bold font-display text-lg">Extracting Skeleton...</h3>
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
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                       <Play className="w-4 h-4 text-white ml-1" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                       <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                       <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : uploadedImage ? (
               <motion.div 
                 key="preview"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center bg-black"
               >
                 <img src={uploadedImage} alt="Uploaded Base" className="w-full h-full object-contain opacity-50 blur-sm scale-110" />
                 <img src={uploadedImage} alt="Uploaded Base" className="absolute w-full h-full object-contain drop-shadow-2xl" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-black/20">
                    <Play className="w-12 h-12 mb-4 opacity-70 drop-shadow-lg" />
                    <p className="font-medium drop-shadow-md bg-black/40 px-3 py-1 rounded-full text-xs uppercase tracking-wider">Ready to connect skeleton</p>
                 </div>
               </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-6 text-white/30"
              >
                 <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                 <p className="font-medium">Upload image to preview</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
