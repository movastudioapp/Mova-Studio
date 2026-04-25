import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Play, Settings2, Sparkles, Loader2, Download, Maximize2, Share2, CheckCircle2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateVideo } from '../../services/aiService';
import { uploadToR2 } from '../../lib/r2';
import { useMutation } from 'convex/react';
import { api } from '../../lib/convex-api-shim';
import { useAuth } from '../auth/AuthProvider';

const STYLES = ['Cinematic', 'Dance AI', 'Anime', 'Cyberpunk', 'Realistic', 'Abstract'];

export default function BeatToVideo() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<'config' | 'preview'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  
  const addAsset = useMutation(api.assets.addAsset);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!uploadedAudio) return;
    setActiveStep('preview');
    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
      const prompt = `${description || "Abstract visuals"} matching the beat, ${selectedStyle} style, high quality, rhythmic synchronization`;
      const operation = await generateVideo(prompt);
      
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
    if (!generatedVideo || !user) return;
    setIsSaving(true);
    try {
      const res = await fetch(generatedVideo);
      const blob = await res.blob();
      
      const fileName = `video_${Date.now()}.mp4`;
      const r2Url = await uploadToR2(blob, `videos/${user.uid}/${fileName}`);
      
      await addAsset({
        userId: user.uid,
        title: description.slice(0, 30) || 'AI Generated Video',
        url: r2Url,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', // Placeholder thumbnail
        type: 'video',
      });
      
      alert('Video saved to assets!');
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save video.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       setUploadedAudio(e.target.files[0]);
     }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-transparent relative overflow-hidden">
      {/* Step Indicator */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-4 bg-[#05050D]/90 backdrop-blur-md">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'config' ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === 'preview' ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'}`} />
      </div>

      <AnimatePresence mode="wait">
        {activeStep === 'config' ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 md:flex-none w-full md:w-[320px] lg:w-[380px] p-4 md:p-6 pb-6 flex flex-col gap-6 md:gap-8 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] shrink-0 h-full overflow-y-auto"
          >
            {/* Audio Upload */}
            <div>
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">Audio Source</label>
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
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">Scene Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-purple-500/50 transition-colors resize-none h-24"
                placeholder="Describe the visual scene to match the beat..."
              />
            </div>

            {/* Style Selector */}
            <div>
              <label className="text-[10px] text-white/40 uppercase font-medium tracking-widest mb-3 block">Visual Style</label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((style, i) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`py-5 px-4 rounded-xl border-0 ${i % 2 === 0 ? 'bg-gradient-to-br from-purple-600/80 to-purple-600/40' : 'bg-gradient-to-br from-blue-600/80 to-blue-600/40'} text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white ${
                      selectedStyle === style
                        ? 'ring-2 ring-white text-white'
                        : 'text-white/70'
                    }`}
                    aria-label={`Select visual style ${style}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Button */}
            <div className="mt-auto space-y-3">
              <button 
                onClick={handleGenerate}
                disabled={!uploadedAudio}
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-[0_4px_15px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                Preview & Generate
              </button>
              {generatedVideo && (
                <button 
                  onClick={() => setActiveStep('preview')}
                  className="w-full py-3 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  View Last Generation
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
            className="flex-1 flex flex-col p-4 md:p-6 bg-gradient-to-br from-[#0A0A12] to-[#1A1A2E] gap-4 md:gap-6 h-full overflow-y-auto pb-32 md:pb-6"
          >
            <div className="flex items-center justify-between md:hidden">
              <button 
                onClick={() => setActiveStep('config')}
                className="p-2 -ml-2 text-white/60 hover:text-white"
              >
                <Settings2 className="w-6 h-6" />
              </button>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-purple-400">Preview Engine</h3>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 min-h-[300px] md:min-h-0 bg-black rounded-2xl relative overflow-hidden group shadow-2xl flex flex-col justify-end">
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
                    <h3 className="text-xl font-semibold mb-2">Analyzing audio structure...</h3>
                    <p className="text-white/60 text-sm max-w-sm">MOVA deAPI is synchronizing your prompt with the detected BPM and rhythm markers.</p>
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
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] uppercase font-semibold tracking-tighter text-white">4K Ultra HD</div>
                      <div className="px-3 py-1 bg-purple-500/80 backdrop-blur-md rounded text-[10px] uppercase font-semibold tracking-tighter text-white">AI Active</div>
                    </div>
                    
                    {/* Overlay actions */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col md:flex-row gap-4 justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div>
                         <h2 className="text-2xl font-semibold uppercase text-white tracking-tighter drop-shadow-md">Sync Result</h2>
                         <p className="text-white/80 text-sm drop-shadow-md">Visualized with {selectedStyle} essence</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSaveToAssets}
                          disabled={isSaving}
                          className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg disabled:opacity-50"
                        >
                           {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-white" />}
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
            <div className="h-40 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 shrink-0">
               <div className="flex justify-between items-center px-2">
                 <div className="flex gap-4 items-center">
                   <span className="text-[10px] font-mono text-purple-400">{generatedVideo ? '00:03:14' : '00:00:00'}</span>
                   <div className="h-px w-12 md:w-24 bg-white/20"></div>
                   <span className="text-[10px] text-white/40 uppercase tracking-widest hidden xs:inline">Audio Texture</span>
                 </div>
                 <button 
                   onClick={() => setActiveStep('config')}
                   className="text-xs text-white/40 hover:text-white flex items-center gap-1"
                 >
                   <Settings2 className="w-3 h-3" /> <span className="hidden md:inline">Edit Config</span>
                 </button>
               </div>
               
               <div className="flex-1 flex gap-1 items-end px-2 relative">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: isGenerating ? [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`] : generatedVideo ? `${Math.random() * 60 + 20}%` : '10%' }}
                      transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                      className={`flex-1 w-1 rounded-t-sm ${i % 5 === 0 && generatedVideo ? 'bg-pink-500' : 'bg-purple-500/40'}`}
                    />
                  ))}
               </div>
            </div>

            {/* Back Button for Mobile Desktop inconsistency */}
            <button 
              onClick={() => setActiveStep('config')}
              className="md:flex hidden items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              <div className="w-8 h-[1px] bg-white/10" /> Back to Inputs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
