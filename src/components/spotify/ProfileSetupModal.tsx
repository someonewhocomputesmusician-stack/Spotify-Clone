import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSpotify } from '@/context/SpotifyContext';
import { User, Music, Headphones, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileSetupModal: React.FC = () => {
  const { user, userProfile, updateProfile } = useSpotify();
  const [selectedType, setSelectedType] = useState<'listener' | 'artist' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = !!user && userProfile !== null && !userProfile?.isProfileSetup;

  const handleComplete = async () => {
    if (!selectedType) return;
    setIsSubmitting(true);
    try {
      await updateProfile({
        profileType: selectedType,
        isProfileSetup: true
      });
    } catch (error) {
      console.error("Failed to setup profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Spotify</DialogTitle>
          <DialogDescription className="text-zinc-400 text-center">
            How would you like to use Spotify today? You can always change this later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('listener')}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${
              selectedType === 'listener' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedType === 'listener' ? 'bg-green-500 text-black' : 'bg-zinc-700 text-zinc-300'
            }`}>
              <Headphones size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Listener</h3>
              <p className="text-sm text-zinc-400">Discover and stream your favorite music.</p>
            </div>
            {selectedType === 'listener' && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-black" />
              </div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('artist')}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${
              selectedType === 'artist' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedType === 'artist' ? 'bg-green-500 text-black' : 'bg-zinc-700 text-zinc-300'
            }`}>
              <Music size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Artist</h3>
              <p className="text-sm text-zinc-400">Upload your own tracks and build a fan base.</p>
            </div>
            {selectedType === 'artist' && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-black" />
              </div>
            )}
          </motion.div>
        </div>

        <DialogFooter>
          <Button
            disabled={!selectedType || isSubmitting}
            onClick={handleComplete}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6 rounded-full text-lg transition-all"
          >
            {isSubmitting ? 'Setting up...' : 'Get Started'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
