import { useState } from 'react';
import { Sparkles, Loader2, ImagePlus, Save, Settings2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateImage } from '../../services/aiService';
import { uploadToR2 } from '../../lib/r2';
import { useMutation } from 'convex/react';
import { api } from '../../lib/convex-api-shim';
import { useAuth } from '../auth/AuthProvider';

const STYLES = ['Cinematic', 'Anime', 'Realistic', 'Abstract', '3D Render', 'Concept Art'];

export default function TextToImage() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<'config' | 'preview'>('config');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const addAsset = useMutation(api.assets.addAsset);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setActiveStep('preview');
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(`${prompt}, style of ${selectedStyle}, highly detailed, 4k`);
      setGeneratedImage(imageUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToAssets = async () => {
    if (!generatedImage || !user) return;
    setIsSaving(true);
    try {
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      
      const fileName = `generated_${Date.now()}.png`;
      const r2Url = await uploadToR2(blob, `assets/${user.uid}/${fileName}`);
      
      await addAsset({
        userId: user.uid,
        title: prompt.slice(0, 30) || 'AI Generated Image',
        url: r2Url,
        thumbnailUrl: r2Url,
        type: 'image',
      });
      
      alert('Saved to assets!');
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save asset.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-transparent relative overflow-hidden">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-4 bg-[#05050D]/90 backdrop-blur-md">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'config' ? 'w-8 bg-[#FF007F]' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'preview' ? 'w-8 bg-[#FF007F]' : 'w-2 bg-white/10'}`} />
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
            <div>
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-[0.2em] mb-3 block">Image Prompt (Gemini API)</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-sm text-white/90 rounded-2xl p-4 focus:outline-none focus:border-[#FF007F]/50 transition-colors resize-none h-32 md:h-40"
                placeholder="A futuristic cyberpunk city with neon purple lights, flying cars, rain reflecting on the streets..."
              />
            </div>

            <div>
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-[0.2em] mb-3 block">Art Style</label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((style, i) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`py-5 px-4 rounded-xl border-0 ${i % 2 === 0 ? 'bg-gradient-to-br from-[#FF007F]/80 to-[#FF007F]/40' : 'bg-gradient-to-br from-[#B200FF]/80 to-[#B200FF]/40'} text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white ${
                      selectedStyle === style
                        ? 'ring-2 ring-white text-white'
                        : 'text-white/70'
                    }`}
                    aria-label={`Select art style ${style}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#B200FF] text-white font-semibold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" /> Generate Image
              </button>
              {generatedImage && (
                <button 
                  onClick={() => setActiveStep('preview')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-medium uppercase tracking-widest text-[10px] hover:text-white transition-all"
                >
                  View Last Result
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
            className="flex-1 flex flex-col p-4 md:p-6 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] h-full overflow-y-auto pb-32 md:pb-6 gap-6"
          >
            <div className="flex items-center justify-between md:hidden">
              <button 
                onClick={() => setActiveStep('config')}
                className="p-2 -ml-2 text-white/60 hover:text-white"
              >
                <Settings2 className="w-6 h-6" />
              </button>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#FF007F]">Image Engine</h3>
              <div className="w-10" />
            </div>

            <div className="flex-1 rounded-[2.5rem] overflow-hidden relative flex items-center justify-center bg-[#05050A] shadow-2xl min-h-[400px]">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      key="dreaming"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center text-center p-8 bg-[#05050A]/90 absolute inset-0 z-10 justify-center"
                    >
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 mb-6 relative"
                      >
                        <Sparkles className="w-full h-full text-[#FF007F] absolute inset-0" />
                        <Sparkles className="w-full h-full text-[#B200FF] absolute inset-0 blur-xl opacity-50" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold uppercase tracking-widest text-white mb-2">Dreaming Result...</h3>
                      <p className="text-white/40 text-xs font-medium max-w-xs uppercase tracking-wider leading-relaxed">Gemini AI is processing your prompt into high-fidelity pixels</p>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full relative group"
                    >
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-contain" 
                      />
                      <div className="absolute top-6 right-6 flex gap-2">
                         <button className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Download className="w-4 h-4 text-white" />
                         </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-white/20 flex flex-col items-center">
                        <ImagePlus className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-xs font-medium uppercase tracking-widest">Image preview waiting</p>
                    </div>
                  )}
                </AnimatePresence>
            </div>
            
            <div className="mt-2 md:mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button 
                  onClick={() => setActiveStep('config')}
                  className="hidden md:flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                >
                  <div className="w-8 h-[1px] bg-white/10" /> Back to Prompt
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    disabled={!generatedImage || isSaving} 
                    onClick={handleSaveToAssets}
                    className="flex-1 sm:flex-none px-8 py-3 bg-[#FF007F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,0,127,0.3)]"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save File'}
                  </button>
                  <button 
                    disabled={!generatedImage} 
                    className="flex-1 sm:flex-none px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold uppercase tracking-widest disabled:opacity-50 hover:bg-white/10 transition-all"
                  >
                    Animate
                  </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
