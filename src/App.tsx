/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpotifyProvider } from './context/SpotifyContext';
import { Sidebar } from './components/spotify/Sidebar';
import { MainView } from './components/spotify/MainView';
import { Player } from './components/spotify/Player';

export default function App() {
  return (
    <SpotifyProvider>
      <div className="h-screen flex flex-col bg-black text-white overflow-hidden font-sans">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainView />
        </div>
        <Player />
      </div>
    </SpotifyProvider>
  );
}

