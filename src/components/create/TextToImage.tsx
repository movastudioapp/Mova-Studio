import { useState } from 'react';
import { Sparkles, Loader2, ImagePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

const STYLES = ['Cinematic', 'Anime', 'Realistic', 'Abstract', '3D Render', 'Concept Art'];

export default function TextToImage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    // Call Gemini API if key is present, else simulate
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `${prompt}, style of ${selectedStyle}, highly detailed, 4k`,
            config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
                outputMimeType: 'image/jpeg',
            }
        });
        if (response.generatedImages?.[0]?.image?.imageBytes) {
           setGeneratedImage(`data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setGeneratedImage('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80');
        }, 3000);
      }
    } catch (e) {
      console.error(e);
      // Fallback on error
      setTimeout(() => {
        setGeneratedImage('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80');
      }, 1000);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col-reverse md:flex-row bg-transparent overflow-hidden">
      {/* Left Panel */}
      <div className="flex-1 md:flex-none w-full md:w-1/2 lg:w-2/5 p-5 md:p-6 pb-20 flex flex-col gap-8 overflow-y-auto bg-black/40 md:bg-transparent backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 shrink-0">
        <div>
          <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">Image Prompt (Gemini API)</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-sm text-white/90 rounded-2xl p-4 focus:outline-none focus:border-[#FF007F] transition-colors resize-none h-24 md:h-32"
            placeholder="A futuristic cyberpunk city with neon purple lights, flying cars, rain reflecting on the streets..."
          />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-300 mb-2 block uppercase tracking-wide">Art Style</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedStyle === style
                    ? 'bg-[#FF007F]/20 border-[#FF007F] text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="mt-auto w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#B200FF] text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating via Gemini...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate Image</>
          )}
        </button>
      </div>

      {/* Right Panel */}
      <div className="min-h-[280px] md:min-h-0 shrink-0 md:flex-1 w-full p-4 md:p-6 bg-black/40 flex flex-col relative gap-4">
        <div className="flex-1 rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center bg-[#05050A]">
            {isGenerating ? (
               <div className="flex flex-col items-center text-center p-8">
               <motion.div 
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-16 h-16 mb-4 relative"
               >
                 <Sparkles className="w-full h-full text-[#FF007F] absolute inset-0" />
                 <Sparkles className="w-full h-full text-[#B200FF] absolute inset-0 blur-md" />
               </motion.div>
               <h3 className="font-display text-xl font-bold mb-2">Dreaming...</h3>
             </div>
            ) : generatedImage ? (
               <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain"
               />
            ) : (
                <div className="text-center text-gray-500 flex flex-col items-center">
                    <ImagePlus className="w-12 h-12 mb-4 opacity-50" />
                    <p>Image preview</p>
                </div>
            )}
        </div>
        
        <div className="mt-2 md:mt-4 flex justify-end gap-2">
            <button disabled={!generatedImage} className="glass-button px-6 py-2 bg-white/10 disabled:opacity-50">Save to Assets</button>
            <button disabled={!generatedImage} className="glass-button px-6 py-2 bg-[#00E5FF]/20 text-[#00E5FF] disabled:opacity-50 border-[#00E5FF]/30 hover:bg-[#00E5FF]/30">Animate Image →</button>
        </div>
      </div>
    </div>
  );
}
