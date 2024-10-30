import { create } from 'zustand'

interface PageStore {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

interface RoleStore {
  userRole: string;
  setUserRole: (role: string) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: "",
  setCurrentPage: (page: string) => set({ currentPage: page })
}));

const userRoleStore = create<RoleStore>((set) => ({
  userRole: "user",
  setUserRole: (role: string) => set({ userRole: role})
}));

export {usePageStore, userRoleStore};