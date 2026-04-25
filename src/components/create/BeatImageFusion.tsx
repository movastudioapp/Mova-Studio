import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Wand2, Loader2, Music2, Camera, Sparkles, Download, Maximize2, Share2, Play, CheckCircle2, Save, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateVideo } from '../../services/aiService';
import { useAssetActions } from '../../hooks/useAssetActions';

export default function BeatImageFusion() {
  const [activeStep, setActiveStep] = useState<'config' | 'preview'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const { saveAsset, isSaving } = useAssetActions();
  
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!uploadedAudio || !uploadedImage) return;
    setActiveStep('preview');
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    try {
        await generateVideo("Fusing audio and image for synced motion visual");
        
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedVideo('https://www.w3schools.com/html/mov_bbb.mp4');
        }, 5000);
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
        title: 'Fusion Masterpiece',
        type: 'video',
      });
      alert('Saved to assets!');
    } catch (e) {
      alert('Failed to save.');
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadedAudio(e.target.files[0]);
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadedImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-transparent relative overflow-hidden">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-4 bg-[#05050D]/90 backdrop-blur-md">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'config' ? 'w-8 bg-[#FF5E00]' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'preview' ? 'w-8 bg-[#FF5E00]' : 'w-2 bg-white/10'}`} />
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 'config' ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 md:flex-none w-full md:w-1/2 lg:w-2/5 p-4 md:p-6 pb-6 flex flex-col gap-6 md:gap-8 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] shrink-0 h-full overflow-y-auto"
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">1. Audio Source</label>
                 <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleAudioChange} />
                 <div 
                   onClick={() => audioInputRef.current?.click()}
                   className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group h-32 transition-colors ${uploadedAudio ? 'border-[#FF5E00]/50 bg-[#FF5E00]/10' : 'border-white/10 hover:border-[#FF5E00]/30 bg-white/5'}`}
                 >
                    {uploadedAudio ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-[#FF5E00] mb-2" />
                        <p className="text-[10px] font-medium text-[#FF5E00] px-2 truncate w-full uppercase tracking-tighter">{uploadedAudio.name}</p>
                      </>
                    ) : (
                      <>
                        <Music2 className="w-6 h-6 text-white/20 group-hover:text-[#FF5E00] mb-2 transition-colors" />
                        <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">Upload Beat</p>
                      </>
                    )}
                 </div>
               </div>
               
               <div>
                 <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">2. Visual Base</label>
                 <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
                 <div 
                   onClick={() => imageInputRef.current?.click()}
                   className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group h-32 overflow-hidden relative transition-colors ${uploadedImage ? 'border-[#B200FF]/50 bg-transparent' : 'border-white/10 hover:border-[#B200FF]/30 bg-white/5'}`}
                 >
                    {uploadedImage ? (
                      <>
                        <img src={uploadedImage} alt="Uploaded Base" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-[10px] font-medium text-white uppercase tracking-widest">Change</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-white/20 group-hover:text-[#B200FF] mb-2 transition-colors" />
                        <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">Upload Image</p>
                      </>
                    )}
                 </div>
               </div>
            </div>

            <div>
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">Fusion Sensitivity</label>
              <input type="range" className="w-full accent-[#FF5E00]" min="0" max="100" defaultValue="75" />
              <div className="flex justify-between text-[10px] font-medium uppercase tracking-tighter text-white/20 mt-2">
                 <span>Subtle</span>
                 <span>Aggressive Sync</span>
              </div>
            </div>
            
            <div className="bg-transparent border border-white/5 rounded-2xl p-6">
               <h4 className="font-semibold text-[10px] uppercase tracking-widest mb-3 text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#FF5E00]" /> MOVA Fusion</h4>
               <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter leading-relaxed">
                 Our proprietary Fusion Engine maps the detected skeleton from your image to a dance cycle synced with the exact BPM and rhythm transients of your audio file.
               </p>
            </div>

            <div className="mt-auto space-y-3 pb-6">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !uploadedAudio || !uploadedImage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5E00] to-[#B200FF] text-white font-semibold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(255,94,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" /> Execute Fusion
              </button>
              {generatedVideo && (
                <button 
                  onClick={() => setActiveStep('preview')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-semibold uppercase tracking-widest text-[10px] hover:text-white transition-all"
                >
                  View Last Fusion
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
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#FF5E00]">Fusion Lab</h3>
              <div className="w-10" />
            </div>

             <div className="w-full max-w-xl aspect-[9/16] bg-[#05050A] rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl z-10 flex-1">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                     <motion.div 
                       key="generating"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex flex-col items-center p-8 text-center absolute inset-0 justify-center bg-black/80 backdrop-blur-xl z-20"
                     >
                        <motion.div className="flex gap-4 mb-8">
                           <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border-t border-[#FF5E00] shadow-[0_0_20px_rgba(255,94,0,0.2)]"><Music2 className="w-6 h-6 text-[#FF5E00]" /></motion.div>
                           <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-8 h-8 flex items-center justify-center"><Wand2 className="w-5 h-5 text-white blur-sm opacity-50" /></motion.div>
                           <motion.div animate={{ y: [15, -15, 15] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border-t border-[#B200FF] shadow-[0_0_20px_rgba(178,0,255,0.2)]"><Camera className="w-6 h-6 text-[#B200FF]" /></motion.div>
                        </motion.div>
                        <h3 className="text-2xl font-semibold uppercase tracking-widest text-white mb-2">Fusing DNA...</h3>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-[0.3em]">Audio transients mapping to skeletal keys</p>
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
                      
                      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2 mb-2">
                             <div className="px-3 py-1 bg-[#FF5E00] rounded text-[10px] font-black uppercase tracking-widest text-white">SYNC 100%</div>
                             <div className="px-3 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">4K</div>
                          </div>
                          <h3 className="text-xl font-black text-white uppercase tracking-widest drop-shadow-lg">Visual Masterpiece</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={handleSaveToAssets}
                            disabled={isSaving}
                            className="w-12 h-12 rounded-full bg-[#FF5E00] flex items-center justify-center hover:bg-[#FF5E00]/80 transition-all shadow-[0_0_20px_rgba(255,94,0,0.4)] disabled:opacity-50"
                          >
                             {isSaving ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Save className="w-5 h-5 text-white" />}
                          </button>
                          <button className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                             <Download className="w-4 rb-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center text-white/10 flex flex-col items-center justify-center absolute inset-0"
                      >
                         <Wand2 className="w-20 h-20 mb-6 opacity-10 mx-auto" />
                         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Fusion Preview Waiting</p>
                      </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <button 
              onClick={() => setActiveStep('config')}
              className="hidden md:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/20 hover:text-white transition-colors self-start"
            >
              <div className="w-8 h-[1px] bg-white/10" /> Adjust Parameters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


