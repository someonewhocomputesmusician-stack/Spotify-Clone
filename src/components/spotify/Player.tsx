import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, ListMusic, MonitorSpeaker, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useSpotify } from '@/context/SpotifyContext';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Player: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume, progress, duration, seek, nextTrack, previousTrack } = useSpotify();

  if (!currentTrack) return null;

  return (
    <div className="h-24 bg-black border-t border-zinc-800 px-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="w-14 h-14 rounded object-cover shadow-lg"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium hover:underline cursor-pointer">{currentTrack.title}</span>
          <span className="text-zinc-400 text-xs hover:underline cursor-pointer">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 max-w-[40%] w-full">
        <div className="flex items-center gap-6">
          <Shuffle size={18} className="text-zinc-400 hover:text-white cursor-pointer transition-colors" />
          <SkipBack 
            size={20} 
            className="text-zinc-400 hover:text-white cursor-pointer transition-colors" 
            onClick={previousTrack}
          />
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="black" className="text-black" /> : <Play size={20} fill="black" className="text-black ml-0.5" />}
          </button>
          <SkipForward 
            size={20} 
            className="text-zinc-400 hover:text-white cursor-pointer transition-colors" 
            onClick={nextTrack}
          />
          <Repeat size={18} className="text-zinc-400 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-zinc-400 min-w-[30px] text-right">{formatTime(progress)}</span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={1} 
            onValueChange={(val) => seek(val[0])}
            className="flex-1"
          />
          <span className="text-[10px] text-zinc-400 min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className="flex items-center gap-3 w-[30%] justify-end">
        <Mic2 size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
        <ListMusic size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
        <MonitorSpeaker size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
        <div className="flex items-center gap-2 w-32">
          <Volume2 size={16} className="text-zinc-400" />
          <Slider 
            value={[volume * 100]} 
            max={100} 
            step={1} 
            onValueChange={(val) => setVolume(val[0] / 100)}
          />
        </div>
        <Maximize2 size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};
