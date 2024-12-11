import { create } from "zustand";
import { ReceivedTeam } from "../Type";

interface SearchTeamStore {
    searchResults: ReceivedTeam[],
    setSearchResults: (results: ReceivedTeam[]) => void;
}

export const useSearchTeamStore = create<SearchTeamStore>((set) => ({
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