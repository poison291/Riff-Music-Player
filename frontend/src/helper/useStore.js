import { create } from 'zustand';

export const useStore = create((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  currentSong: null,
  setCurrentSong: (song) => set({ currentSong: song }),
  isPlaying: false
}));