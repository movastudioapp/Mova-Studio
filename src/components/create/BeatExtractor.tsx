import { useState } from 'react';
import { extractBeatData } from '../../services/beatService';
import { useAuth } from '../auth/AuthProvider';
import { useMutation } from 'convex/react';
import { api } from '../../lib/convex-api-shim';
import { Upload, Music, Loader2, Check } from 'lucide-react';

export default function BeatExtractor() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const saveBeatPack = useMutation(api.beatPacks.saveBeatPack);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data: any = await extractBeatData(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to extract beats');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !result) return;
    await saveBeatPack({
      userId: user.uid,
      title: file?.name || 'Untitled Beat Pack',
      audioUrl: 'placeholder-url', // In real app, upload file first
      bpm: result.bpm,
      rhythmPatterns: result.rhythmPatterns,
      beatMarkers: result.beatMarkers,
    });
    alert('Beat Pack Saved!');
    setResult(null);
    setFile(null);
  };

  return (
    <div className="p-6 bg-[#0A0A0F] rounded-3xl border border-white/5 space-y-6">
      <h2 className="text-xl font-bold text-white">Extract Beat Pack</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20" />
      
      {file && !result && (
        <button onClick={handleExtract} className="w-full py-3 bg-purple-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Music className="w-5 h-5" />}
          {loading ? 'Analyzing...' : 'Extract Beats'}
        </button>
      )}

      {result && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/70">BPM: {result.bpm}</p>
          <button onClick={handleSave} className="w-full py-3 bg-emerald-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Save Beat Pack
          </button>
        </div>
      )}
    </div>
  );
}
