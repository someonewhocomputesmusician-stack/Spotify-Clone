import React from 'react';
import { Home, Search, Library, Plus, Heart, ListMusic, Upload, LogIn, LogOut } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSpotify } from '@/context/SpotifyContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; collapsed?: boolean }> = ({ icon, label, active, onClick, collapsed }) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-200 rounded-md",
      active ? "text-white bg-white/10" : "text-zinc-400 hover:text-white",
      collapsed && "justify-center px-0"
    )}
    title={collapsed ? label : undefined}
  >
    {icon}
    {!collapsed && <span className="font-semibold text-sm truncate">{label}</span>}
  </div>
);

export const Sidebar: React.FC = () => {
  const { view, setView, sidebarCollapsed, toggleSidebar, user, login, logout, isAuthReady } = useSpotify();

  return (
    <div className={cn(
      "bg-black h-full flex flex-col p-2 gap-2 transition-all duration-300 ease-in-out",
      sidebarCollapsed ? "w-[72px]" : "w-64"
    )}>
      <div className="bg-zinc-900/50 rounded-lg p-2">
        <SidebarItem 
          icon={<Home size={24} />} 
          label="Home" 
          active={view === 'home'} 
          onClick={() => setView('home')}
          collapsed={sidebarCollapsed}
        />
        <SidebarItem 
          icon={<Search size={24} />} 
          label="Search" 
          active={view === 'search'} 
          onClick={() => setView('search')}
          collapsed={sidebarCollapsed}
        />
        {user && (
          <SidebarItem 
            icon={<Upload size={24} />} 
            label="Upload" 
            active={view === 'upload'} 
            onClick={() => setView('upload')}
            collapsed={sidebarCollapsed}
          />
        )}
      </div>

      <div className="flex-1 bg-zinc-900/50 rounded-lg flex flex-col overflow-hidden">
        <div className={cn(
          "p-4 flex items-center text-zinc-400",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          <div 
            onClick={toggleSidebar}
            className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"
            title={sidebarCollapsed ? "Expand Your Library" : "Collapse Your Library"}
          >
            <Library size={24} />
            {!sidebarCollapsed && <span className="font-semibold text-sm">Your Library</span>}
          </div>
          {!sidebarCollapsed && <Plus size={20} className="hover:text-white cursor-pointer transition-colors" />}
        </div>

        <ScrollArea className="flex-1 px-2">
          {user ? (
            <div className="flex flex-col gap-1">
              <div className={cn(
                "flex items-center gap-3 p-2 hover:bg-white/5 rounded-md cursor-pointer group",
                sidebarCollapsed && "justify-center"
              )}>
                <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-indigo-700 to-blue-300 rounded flex items-center justify-center">
                  <Heart size={20} fill="white" className="text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col truncate">
                    <span className="text-white text-sm font-medium truncate">Liked Songs</span>
                    <span className="text-zinc-400 text-xs truncate">Playlist • 124 songs</span>
                  </div>
                )}
              </div>

              <div className={cn(
                "flex items-center gap-3 p-2 hover:bg-white/5 rounded-md cursor-pointer group",
                sidebarCollapsed && "justify-center"
              )}>
                <div className="w-12 h-12 min-w-[48px] bg-zinc-800 rounded flex items-center justify-center">
                  <ListMusic size={20} className="text-zinc-400" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col truncate">
                    <span className="text-white text-sm font-medium truncate">My Playlist #1</span>
                    <span className="text-zinc-400 text-xs truncate">Playlist • User</span>
                  </div>
                )}
              </div>

              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-3 p-2 hover:bg-white/5 rounded-md cursor-pointer group",
                  sidebarCollapsed && "justify-center"
                )}>
                  <img 
                    src={`https://picsum.photos/seed/playlist${i}/48/48`} 
                    alt="Playlist" 
                    className="w-12 h-12 min-w-[48px] rounded object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!sidebarCollapsed && (
                    <div className="flex flex-col truncate">
                      <span className="text-white text-sm font-medium truncate">Chill Vibes {i + 1}</span>
                      <span className="text-zinc-400 text-xs truncate">Playlist • Spotify</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center space-y-4">
              {!sidebarCollapsed && (
                <>
                  <p className="text-sm text-zinc-400">Log in to see your library and upload tracks.</p>
                  <button 
                    onClick={login}
                    className="w-full bg-white text-black font-bold py-2 rounded-full hover:scale-105 transition-transform"
                  >
                    Log In
                  </button>
                </>
              )}
              {sidebarCollapsed && (
                <button 
                  onClick={login}
                  className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform"
                  title="Log In"
                >
                  <LogIn size={20} />
                </button>
              )}
            </div>
          )}
        </ScrollArea>

        {user && (
          <div className="p-2 mt-auto">
            <div className={cn(
              "flex items-center gap-3 p-2 bg-zinc-900/80 rounded-lg",
              sidebarCollapsed ? "justify-center" : "justify-between"
            )}>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-xs font-bold truncate">{user.displayName}</span>
                    <button 
                      onClick={logout}
                      className="text-zinc-400 text-[10px] hover:text-white text-left"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <button onClick={logout} className="text-zinc-400 hover:text-white">
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

