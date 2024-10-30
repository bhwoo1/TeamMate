import { create } from 'zustand'

interface PageStore {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

interface RoleStore {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: "",
  setCurrentPage: (page: string) => set({ currentPage: page })
}));

const userRoleStore = create<RoleStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (state: boolean) => set({ isAdmin: state})
}));

export {usePageStore, userRoleStore};