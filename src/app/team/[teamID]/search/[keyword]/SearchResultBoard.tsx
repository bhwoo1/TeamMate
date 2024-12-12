"use client";

import { useSearchPostStore } from "@/app/zustand/store";
import BoardTemplate from "../../community/BoardTemplate";

const SearchResultBoard = ({ teamID }: { teamID: number }) => {
    const { searchResults } = useSearchPostStore();

    return (
        <BoardTemplate teamID={teamID} posts={searchResults} />
    );
};

export default SearchResultBoard;