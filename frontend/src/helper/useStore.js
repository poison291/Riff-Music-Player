import { create } from 'zustand';

export const useStore = create((set) => ({
  activeTab: 'library',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));