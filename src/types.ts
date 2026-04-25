export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
}

export interface VideoAsset {
  id: string;
  userId: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  type: 'video' | 'image' | 'audio';
  status: 'processing' | 'ready' | 'error';
  createdAt: number;
}

export interface GenerationRequest {
  id: string;
  userId: string;
  prompt: string;
  type: 'video' | 'image' | 'song';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  createdAt: number;
}
