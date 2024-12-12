import { create } from "zustand";
import { ReceivedPost, ReceivedTeam } from "../Type";

interface SearchTeamStore {
    searchResults: ReceivedTeam[],
    setSearchResults: (results: ReceivedTeam[]) => void;
}

export const useSearchTeamStore = create<SearchTeamStore>((set) => ({
    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),
}));

interface SearchPostStore {
    searchResults: ReceivedPost[],
    setSearchResults: (results: ReceivedPost[]) => void;
}

export const useSearchPostStore = create<SearchPostStore>((set) => ({
    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),
}));

interface PageStore {
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

export const usePageStore = create<PageStore>((set) => ({
    currentPage: "",
    setCurrentPage: (page: string) => set({ currentPage: page })
}));

interface RoleStore {
    isAdmin: string;
    setIsAdmin: (isAdmin: string) => void;
}

export const userRoleStore = create<RoleStore>((set) => ({
    isAdmin: "user",
    setIsAdmin: (state: string) => set({ isAdmin: state})
}));