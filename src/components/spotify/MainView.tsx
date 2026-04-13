import React from 'react';
import { Play, ChevronLeft, ChevronRight, Bell, Users, Search, PanelLeft, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_TRACKS, CATEGORIES } from '@/constants';
import { useSpotify } from '@/context/SpotifyContext';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { UploadView } from './UploadView';

export const MainView: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, view, setView, searchQuery, setSearchQuery, userTracks, toggleSidebar, userProfile } = useSpotify();

  const allTracks = [...MOCK_TRACKS, ...userTracks];
  const isArtist = userProfile?.profileType === 'artist';

  const filteredTracks = allTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SpotifyLogo = () => (
    <div className="flex items-center gap-1 opacity-20 pointer-events-none select-none">
      <div className="w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center">
        <Music size={14} className="text-black fill-black" />
      </div>
      <span className="text-white font-bold tracking-tighter text-lg">Spotify</span>
    </div>
  );

  if (view === 'upload' && !isArtist) {
    setView('home');
    return null;
  }

  if (view === 'upload') {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col overflow-hidden rounded-lg m-2 ml-0 relative">
        <div className="absolute bottom-6 right-8 z-0">
          <SpotifyLogo />
        </div>
        <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-zinc-800/50 backdrop-blur-md z-10 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors mr-2"
              title="Toggle Sidebar"
            >
              <PanelLeft size={18} />
            </button>
            <button 
              onClick={() => useSpotify().setView('home')}
              className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </header>
        <UploadView />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col overflow-hidden rounded-lg m-2 ml-0 relative">
      <div className="absolute bottom-6 right-8 z-0">
        <SpotifyLogo />
      </div>
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-zinc-800/50 backdrop-blur-md z-10 gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors mr-2"
            title="Toggle Sidebar"
          >
            <PanelLeft size={18} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {view === 'search' && (
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="text"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-700/50 hover:bg-zinc-700 border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-white transition-all outline-none"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <button className="bg-white text-black text-sm font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform hidden sm:block">
            Explore Premium
          </button>
          <button className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors">
            <Bell size={18} />
          </button>
          <button className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors">
            <Users size={18} />
          </button>
          <Avatar className="w-8 h-8 border-2 border-black/40 cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 relative z-10">
          {view === 'home' ? (
            <>
              {/* Greeting Section */}
              <section>
                <h1 className="text-3xl font-bold text-white mb-6">Good afternoon</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTracks.slice(0, 6).map((track) => (
                    <div 
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className="group bg-white/5 hover:bg-white/10 transition-colors rounded-md flex items-center gap-4 overflow-hidden cursor-pointer relative"
                    >
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-20 h-20 object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-white font-bold text-sm truncate pr-12">{track.title}</span>
                      <button className="absolute right-4 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                        <Play size={24} fill="black" className="text-black ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* User Uploads */}
              {userTracks.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Your Uploads</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {userTracks.map((track) => (
                      <motion.div 
                        key={track.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => playTrack(track)}
                        className="bg-zinc-900/40 hover:bg-zinc-800/60 p-4 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="relative aspect-square mb-4">
                          <img 
                            src={track.coverUrl} 
                            alt={track.title} 
                            className="w-full h-full object-cover rounded-md shadow-2xl"
                            referrerPolicy="no-referrer"
                          />
                          <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                            <Play size={24} fill="black" className="text-black ml-1" />
                          </button>
                        </div>
                        <h3 className="text-white font-bold text-sm truncate mb-1">{track.title}</h3>
                        <p className="text-zinc-400 text-xs line-clamp-2">{track.artist}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recently Played */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Recently Played</h2>
                  <span className="text-zinc-400 text-sm font-bold hover:underline cursor-pointer">Show all</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {MOCK_TRACKS.map((track) => (
                    <motion.div 
                      key={track.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => playTrack(track)}
                      className="bg-zinc-900/40 hover:bg-zinc-800/60 p-4 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="relative aspect-square mb-4">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover rounded-md shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                          <Play size={24} fill="black" className="text-black ml-1" />
                        </button>
                      </div>
                      <h3 className="text-white font-bold text-sm truncate mb-1">{track.title}</h3>
                      <p className="text-zinc-400 text-xs line-clamp-2">{track.artist}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Browse All */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Browse All</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {CATEGORIES.map((cat) => (
                    <div 
                      key={cat.id}
                      className={`${cat.color} aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                    >
                      <span className="text-white text-xl font-bold">{cat.name}</span>
                      <img 
                        src={`https://picsum.photos/seed/${cat.name}/100/100`} 
                        alt={cat.name}
                        className="absolute -right-4 -bottom-2 w-24 h-24 rotate-[25deg] shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">
                {searchQuery ? `Search results for "${searchQuery}"` : "Recent searches"}
              </h2>
              {filteredTracks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredTracks.map((track, index) => (
                    <motion.div 
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => playTrack(track)}
                      className="group flex items-center gap-4 p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="w-10 text-zinc-400 text-right font-medium group-hover:text-white">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play size={14} className="hidden group-hover:inline-block fill-white text-white" />
                      </div>
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover rounded shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "text-white font-medium truncate",
                          currentTrack?.id === track.id && "text-green-500"
                        )}>
                          {track.title}
                        </h3>
                        <p className="text-zinc-400 text-sm truncate">{track.artist}</p>
                      </div>
                      <div className="hidden md:block text-zinc-400 text-sm flex-1 truncate">
                        {track.album || "Single"}
                      </div>
                      <div className="text-zinc-400 text-sm pr-4">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search size={64} className="text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No results found for "{searchQuery}"</h3>
                  <p className="text-zinc-400">Please make sure your words are spelled correctly or use fewer or different keywords.</p>
                </div>
              )}

              {!searchQuery && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Browse All</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => (
                      <div 
                        key={cat.id}
                        className={`${cat.color} aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                      >
                        <span className="text-white text-xl font-bold">{cat.name}</span>
                        <img 
                          src={`https://picsum.photos/seed/${cat.name}/100/100`} 
                          alt={cat.name}
                          className="absolute -right-4 -bottom-2 w-24 h-24 rotate-[25deg] shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

