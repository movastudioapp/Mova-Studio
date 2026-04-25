import { motion, AnimatePresence } from 'motion/react';
import { LogIn, User as UserIcon, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  auth
} from '../lib/firebase';
import { useMutation } from 'convex/react';
import { api } from '../lib/convex-api-shim';
import React, { useState, useEffect } from 'react';

export default function LoginScreen() {
  const storeUser = useMutation(api.users.storeUser);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        await storeUser({
          uid: user.uid,
          email: user.email || undefined,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('Login popup closed by user');
        return;
      }
      console.error('Google login failed:', err);
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user = userCredential.user;
      if (isSignUp && fullName) {
        await updateProfile(user, { displayName: fullName });
      }

      await storeUser({
        uid: user.uid,
        email: user.email || undefined,
        displayName: user.displayName || fullName || undefined,
        photoURL: user.photoURL || undefined,
      });
    } catch (err: any) {
      console.error('Email auth failed:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#020205] overflow-y-auto px-6 py-8">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-purple-600/10 blur-[150px] rounded-full"
        />
      </div>

      <AnimatePresence>
        {mounted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm my-auto"
          >
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-20 h-20 flex items-center justify-center p-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-2xl rounded-full" />
                  <img 
                    src="/input_file_1.png" 
                    alt="Mova Logo" 
                    className="relative z-10 w-full h-full object-contain"
                    onError={(e) => {
                      // Try fallback to input_file_0 if input_file_1 fails
                      if (e.currentTarget.src.includes('input_file_1')) {
                        e.currentTarget.src = '/input_file_0.png';
                        return;
                      }
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const existingFallback = parent.querySelector('.fallback-m');
                        if (!existingFallback) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-m w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_10px_25px_rgba(168,85,247,0.3)]';
                          fallback.innerHTML = '<span class="font-black text-2xl text-white">M</span>';
                          parent.appendChild(fallback);
                        }
                      }
                    }}
                  />
                </motion.div>

                {/* Text */}
                <div className="space-y-0.5">
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold tracking-tighter text-white"
                  >
                    {isSignUp ? 'Launch Studio' : 'Enter Studio'}
                  </motion.h1>
                </div>
              </div>

              {/* Form - Compact Pro Style */}
              <div className="max-w-[280px] mx-auto w-full space-y-4">
                <form onSubmit={handleEmailAuth} className="space-y-2.5">
                  {isSignUp && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/10 group-focus-within:border-purple-500/50 group-focus-within:bg-purple-500/5 transition-all duration-300" />
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="relative w-full h-11 bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none pl-11 pr-5 transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/10 group-focus-within:border-purple-500/50 group-focus-within:bg-purple-500/5 transition-all duration-300" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative w-full h-11 bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none pl-11 pr-5 transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/[0.03] rounded-2xl border border-white/10 group-focus-within:border-purple-500/50 group-focus-within:bg-purple-500/5 transition-all duration-300" />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full h-11 bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none pl-11 pr-5 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-white/5"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex flex-col items-center gap-2.5">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-12 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white/50 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5 grayscale opacity-50 group-hover:opacity-100 transition-all" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Continue with Google</span>
                  </button>

                  <div className="pt-1">
                    <button 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-[9px] text-white/30 hover:text-white font-bold transition-all uppercase tracking-widest"
                    >
                      {isSignUp ? 'Sign In Instead' : 'Create Account'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="mt-3 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10"
                    >
                      <p className="text-[8px] text-red-500/60 text-center font-bold uppercase tracking-widest leading-normal">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/5 pointer-events-none">
        <div className="w-8 h-[1px] bg-white/5" />
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase">MOVA.IO</span>
        <div className="w-8 h-[1px] bg-white/5" />
      </div>
    </div>
  );
}
