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