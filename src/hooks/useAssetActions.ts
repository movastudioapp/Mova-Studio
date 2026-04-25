import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../lib/convex-api-shim';
import { uploadToR2 } from '../lib/r2';
import { useAuth } from '../components/auth/AuthProvider';

export function useAssetActions() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const addAsset = useMutation(api.assets.addAsset);

  const saveAsset = async (params: {
    urlOrBlob: string | Blob;
    title: string;
    type: 'video' | 'audio' | 'image';
    thumbnailUrl?: string;
  }) => {
    if (!user) {
      alert('You must be logged in to save assets.');
      return;
    }
    
    setIsSaving(true);
    try {
      let blob: Blob;
      if (typeof params.urlOrBlob === 'string') {
        const res = await fetch(params.urlOrBlob);
        blob = await res.blob();
      } else {
        blob = params.urlOrBlob;
      }

      const extension = params.type === 'video' ? 'mp4' : params.type === 'audio' ? 'mp3' : 'png';
      const fileName = `${params.type}_${Date.now()}.${extension}`;
      const r2Url = await uploadToR2(blob, `assets/${user.uid}/${fileName}`);

      await addAsset({
        userId: user.uid,
        title: params.title,
        url: r2Url,
        thumbnailUrl: params.thumbnailUrl || r2Url,
        type: params.type,
      });

      return r2Url;
    } catch (error) {
      console.error('Error saving asset:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAsset, isSaving };
}
