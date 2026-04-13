import React, { useState } from 'react';
import { Upload, Music, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSpotify } from '@/context/SpotifyContext';
import { motion, AnimatePresence } from 'motion/react';

export const UploadView: React.FC = () => {
  const { addTrack, setView, user } = useSpotify();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    coverUrl: '',
    audioUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to upload tracks.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const trackData = {
        ...formData,
        duration: 180, // Mock duration
        coverUrl: formData.coverUrl || `https://picsum.photos/seed/${formData.title}/300/300`,
        audioUrl: formData.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      };

      await addTrack(trackData);
      setIsSuccess(true);
      
      setTimeout(() => {
        setView('home');
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload track. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-green-500" size={32} />
                  </div>
                  <h1 className="text-3xl font-bold text-white">Upload your music</h1>
                  <p className="text-zinc-400">Share your tracks with the world (or just yourself)</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-300">Track Title</Label>
                    <Input 
                      id="title"
                      required
                      placeholder="e.g. Midnight City"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist" className="text-zinc-300">Artist</Label>
                    <Input 
                      id="artist"
                      required
                      placeholder="e.g. M83"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="album" className="text-zinc-300">Album</Label>
                  <Input 
                    id="album"
                    placeholder="e.g. Hurry Up, We're Dreaming"
                    value={formData.album}
                    onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio" className="text-zinc-300">Audio URL (MP3)</Label>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <Input 
                      id="audio"
                      placeholder="https://example.com/song.mp3"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white pl-10 focus:ring-green-500"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">Leave empty to use a demo track</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover" className="text-zinc-300">Cover Art URL</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <Input 
                      id="cover"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.coverUrl}
                      onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white pl-10 focus:ring-green-500"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">Leave empty for a random placeholder</p>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : "Upload Track"}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                <CheckCircle2 className="text-black" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white">Upload Successful!</h2>
              <p className="text-zinc-400">Your track has been added to the library.</p>
              <p className="text-zinc-500 text-sm">Redirecting to home...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
