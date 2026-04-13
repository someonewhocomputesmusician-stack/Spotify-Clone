import { Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://picsum.photos/seed/m83/300/300',
    duration: 243,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    coverUrl: 'https://picsum.photos/seed/weeknd/300/300',
    duration: 230,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://picsum.photos/seed/blinding/300/300',
    duration: 200,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    coverUrl: 'https://picsum.photos/seed/dua/300/300',
    duration: 203,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    coverUrl: 'https://picsum.photos/seed/stay/300/300',
    duration: 141,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    coverUrl: 'https://picsum.photos/seed/heat/300/300',
    duration: 238,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: '7',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    coverUrl: 'https://picsum.photos/seed/billie/300/300',
    duration: 194,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: '8',
    title: 'Circles',
    artist: 'Post Malone',
    album: 'Hollywood\'s Bleeding',
    coverUrl: 'https://picsum.photos/seed/post/300/300',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  }
];

export const CATEGORIES = [
  { id: '1', name: 'Podcasts', color: 'bg-orange-600' },
  { id: '2', name: 'Made For You', color: 'bg-blue-600' },
  { id: '3', name: 'Charts', color: 'bg-purple-600' },
  { id: '4', name: 'New Releases', color: 'bg-pink-600' },
  { id: '5', name: 'Discover', color: 'bg-indigo-600' },
  { id: '6', name: 'Live Events', color: 'bg-red-600' },
  { id: '7', name: 'Pop', color: 'bg-green-600' },
  { id: '8', name: 'Hip-Hop', color: 'bg-yellow-600' },
];
