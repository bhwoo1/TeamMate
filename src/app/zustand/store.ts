import { create } from 'zustand'

interface StoreState {
    currentPage: string;
    setCurrentPage: (page: string) => void;
  }

const usePageStore = create<StoreState>(set => ({
  currentPage: "",
  setCurrentPage: (page: string) => set({ currentPage: page })
}))

export default usePageStore;