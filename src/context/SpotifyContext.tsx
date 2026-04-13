import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../constants';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithPopup, 
  googleProvider,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp
} from '@/lib/firebase';
import { User } from 'firebase/auth';

interface SpotifyContextType {
  user: User | null;
  userProfile: any | null;
  isAuthReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profileType: 'listener' | 'artist', isProfileSetup: boolean }) => Promise<void>;
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  view: 'home' | 'search' | 'upload';
  searchQuery: string;
  userTracks: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setView: (view: 'home' | 'search' | 'upload') => void;
  setSearchQuery: (query: string) => void;
  addTrack: (track: Omit<Track, 'id'>) => Promise<void>;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [view, setView] = useState<'home' | 'search' | 'upload'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allTracks = [...MOCK_TRACKS, ...userTracks];

  // Auth listener
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Sync user to Firestore (initial sync)
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: 'user' // Default role
        }, { merge: true });

        // Listen to user profile changes
        unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          }
          setIsAuthReady(true);
        });
      } else {
        setUserProfile(null);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // Firestore tracks listener
  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(collection(db, 'tracks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tracks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Track));
      setUserTracks(tracks);
    }, (error) => {
      console.error("Firestore Error (LIST tracks):", error);
    });

    return unsubscribe;
  }, [isAuthReady]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUserProfile(null);
      setView('home');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = async (data: { profileType: 'listener' | 'artist', isProfileSetup: boolean }) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  };

  const addTrack = async (trackData: Omit<Track, 'id'>) => {
    if (!user) return;
    
    try {
      const trackRef = doc(collection(db, 'tracks'));
      await setDoc(trackRef, {
        ...trackData,
        id: trackRef.id,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Firestore Error (WRITE track):", error);
      throw error;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % allTracks.length;
    playTrack(allTracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    playTrack(allTracks[prevIndex]);
  };

  return (
    <SpotifyContext.Provider value={{
      user,
      userProfile,
      isAuthReady,
      login,
      logout,
      updateProfile,
      currentTrack,
      isPlaying,
      volume,
      progress,
      duration,
      view,
      searchQuery,
      userTracks,
      playTrack,
      togglePlay,
      setVolume,
      seek,
      nextTrack,
      previousTrack,
      setView,
      setSearchQuery,
      addTrack,
      sidebarCollapsed,
      toggleSidebar
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
