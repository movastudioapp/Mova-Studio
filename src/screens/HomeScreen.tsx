import { useState, useRef, useEffect } from 'react';
import { Play, Heart, MessageCircle, Share2, Music2, Download, Sparkles, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_FEED = [
  {
    id: 1,
    creator: '@aivisionary',
    title: 'Neon Cyberpunk Dreams 🌃✨',
    sound: 'Cyberbeat - Original AI',
    tags: ['#cinematic', '#cyberpunk'],
    likes: '124K',
    comments: '1.2K',
    shares: '4K',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
  },
  {
    id: 2,
    creator: '@dance_ai',
    title: 'Beat Sync Challenge 🔥',
    sound: 'Bass Drop 3000 x Mova',
    tags: ['#danceai', '#beatfusion'],
    likes: '89K',
    comments: '400',
    shares: '1K',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    cover: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 3,
    creator: '@future_beats',
    title: 'Galactic Drift 🚀',
    sound: 'Spacetime Continuum',
    tags: ['#space', '#ambient'],
    likes: '45K',
    comments: '890',
    shares: '2.5K',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop'
  }
];

export default function HomeScreen() {
  const [playingId, setPlayingId] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlayingId(Number(entry.target.getAttribute('data-id')));
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll('.feed-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black snap-y snap-mandatory scroll-smooth hide-scrollbar overflow-y-auto">
      {DUMMY_FEED.map((item) => (
        <FeedItem key={item.id} item={item} isPlaying={playingId === item.id} />
      ))}
    </div>
  );
}

function FeedItem({ item, isPlaying }: { item: typeof DUMMY_FEED[0], isPlaying: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      videoRef.current?.play().catch(console.error);
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying, isPaused]);

  const togglePlay = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div data-id={item.id} className="feed-item w-full h-full xl:min-h-0 relative snap-start snap-always">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-black cursor-pointer" onClick={togglePlay}>
        <video 
          ref={videoRef}
          src={item.videoUrl} 
          className="w-full h-full object-cover opacity-90"
          loop
          muted
          playsInline
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />
        
        {/* Play/Pause indicator */}
        <AnimatePresence>
          {isPaused && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Action Bar */}
      <div className="absolute right-4 bottom-32 md:bottom-24 flex flex-col items-center gap-6 z-20">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition">
            <Heart className="w-6 h-6 text-white group-hover:text-[#FF007F] group-hover:fill-[#FF007F] transition" />
          </div>
          <span className="text-xs font-bold shadow-black drop-shadow-md">{item.likes}</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold shadow-black drop-shadow-md">{item.comments}</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold shadow-black drop-shadow-md">{item.shares}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group mt-2">
          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 border-[#00E5FF] ${isPlaying && !isPaused ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <img src={item.cover} className="w-full h-full object-cover blur-sm" />
          </div>
          <div className="bg-[#B200FF] p-1.5 rounded-full absolute -bottom-2 border-2 border-black">
            <Music2 className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-24 md:bottom-16 left-4 right-20 z-20 pointer-events-none">
        <h3 className="font-display font-bold text-xl mb-1 text-white drop-shadow-lg">{item.creator}</h3>
        <p className="text-sm text-gray-200 mb-2 drop-shadow-md line-clamp-2">{item.title}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-black/40 backdrop-blur text-xs font-bold rounded-lg border border-white/10 text-white">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md w-max px-3 py-1.5 rounded-xl border border-white/10">
          <Music2 className="w-4 h-4 text-[#00E5FF]" />
          <div className="w-48 overflow-hidden relative h-5">
             <div className="absolute whitespace-nowrap animate-[marquee_5s_linear_infinite] text-sm font-medium">
                {item.sound} &nbsp; • &nbsp; {item.sound}
             </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 pointer-events-auto">
          <button className="glass-button px-4 py-2 flex items-center gap-2 text-sm font-bold bg-[#B200FF]/20 hover:bg-[#B200FF]/40 border border-[#B200FF]/50 text-white">
            <Sparkles className="w-4 h-4 text-white" /> Remix Style
          </button>
          <button className="glass-button px-4 py-2 flex items-center gap-2 text-sm font-bold bg-white/10">
            <Download className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
