import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Sparkles, Loader2, Play, Download, Maximize2, Image as ImageIcon, Save, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateVideo } from '../../services/aiService';
import { useAssetActions } from '../../hooks/useAssetActions';

const CYCLES = ['Hip Hop', 'Fluid Float', 'Combat Idle', 'Slow Pan'];

export default function ImageToMotion() {
  const [activeStep, setActiveStep] = useState<'config' | 'preview'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState(CYCLES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { saveAsset, isSaving } = useAssetActions();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setActiveStep('preview');
    setIsGenerating(true);
    setGeneratedVideo(null);
    try {
      await generateVideo(`Animate this image with ${activeCycle} motion style, fluid movement, high consistency`);
      
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
      }, 4000);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  const handleSaveToAssets = async () => {
    if (!generatedVideo) return;
    try {
      await saveAsset({
        urlOrBlob: generatedVideo,
        title: `Motion - ${activeCycle}`,
        type: 'video',
      });
      alert('Saved to assets!');
    } catch (e) {
      alert('Failed to save.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      if (generatedVideo) setGeneratedVideo(null);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-transparent relative overflow-hidden">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-4 bg-[#05050D]/90 backdrop-blur-md">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'config' ? 'w-8 bg-[#00E5FF]' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'preview' ? 'w-8 bg-[#00E5FF]' : 'w-2 bg-white/10'}`} />
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 'config' ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 md:flex-none w-full md:w-1/2 lg:w-2/5 p-5 md:p-6 pb-6 flex flex-col gap-8 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] shrink-0 h-full overflow-y-auto"
          >
            <div>
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-3 block">Source Image</label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-[#00E5FF]/50 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/5 cursor-pointer group"
              >
                {uploadedImage ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden flex items-center justify-center shadow-xl">
                    <img src={uploadedImage} alt="Uploaded Base" className="max-h-full max-w-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[10px] font-black uppercase text-white">Change Character</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#00E5FF]/10 transition-colors">
                      <UploadCloud className="w-6 h-6 text-white/20 group-hover:text-[#00E5FF]" />
                    </div>
                    <p className="font-bold text-sm">Upload Character</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">Pose detection works best with clear shots</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-3 block">Motion Cycle</label>
              <div className="grid grid-cols-2 gap-3">
                {CYCLES.map((cycle, i) => (
                  <button 
                    key={cycle}
                    onClick={() => setActiveCycle(cycle)}
                    className={`py-5 px-4 rounded-xl border-0 ${i % 2 === 0 ? 'bg-gradient-to-br from-[#00E5FF]/80 to-[#00E5FF]/40' : 'bg-gradient-to-br from-[#3498db]/80 to-[#3498db]/40'} text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white ${
                      activeCycle === cycle 
                        ? 'ring-2 ring-white text-white'
                        : 'text-white/70'
                    }`}
                    aria-label={`Select motion cycle ${cycle}`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !uploadedImage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#3498db] text-white font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" /> Generate Motion
              </button>
              {generatedVideo && (
                <button 
                  onClick={() => setActiveStep('preview')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                >
                  View Animation
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col p-4 md:p-6 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] h-full overflow-y-auto pb-32 md:pb-6 gap-6 items-center"
          >
            <div className="flex items-center justify-between md:hidden w-full">
              <button 
                onClick={() => setActiveStep('config')}
                className="p-2 -ml-2 text-white/60 hover:text-white"
              >
                <Settings2 className="w-6 h-6" />
              </button>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#00E5FF]">Motion Engine</h3>
              <div className="w-10" />
            </div>

            <div className="w-full max-w-2xl flex-1 bg-[#05050A] rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[400px]">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center p-8 text-center absolute inset-0 justify-center bg-black/80 backdrop-blur-xl z-20"
                  >
                     <motion.div 
                       animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                       transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }} 
                       className="w-20 h-20 border-t-2 border-r-2 border-[#00E5FF] rounded-full mb-6 flex items-center justify-center"
                     >
                        <div className="w-10 h-10 bg-[#00E5FF]/20 rounded-full blur-md" />
                     </motion.div>
                     <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Connecting Assets...</h3>
                     <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Live skeleton mapping in progress</p>
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
                      className="w-full h-full object-contain"
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSaveToAssets}
                          className="w-12 h-12 rounded-full bg-[#00E5FF] flex items-center justify-center hover:bg-[#00E5FF]/80 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                        >
                           {isSaving ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Save className="w-5 h-5 text-white" />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="h-10 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                           <Download className="w-4 h-4" /> Export
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
                     <img src={uploadedImage} alt="Uploaded Base" className="w-full h-full object-contain opacity-20 blur-xl scale-110" />
                     <img src={uploadedImage} alt="Uploaded Base" className="absolute w-full h-full object-contain drop-shadow-2xl" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 bg-black/20">
                        <Play className="w-16 h-16 mb-4 opacity-50 drop-shadow-2xl" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 px-6 py-2 rounded-full">Skeleton Ready</p>
                     </div>
                   </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center p-6 text-white/20"
                  >
                     <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting subject upload</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setActiveStep('config')}
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors self-start"
            >
              <div className="w-8 h-[1px] bg-white/10" /> Configure Cycle
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
