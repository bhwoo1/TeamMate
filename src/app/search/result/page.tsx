"use client"

import { useSearchTeamStore } from "@/app/zustand/store";

const SearchResultPage = () => {
    const { searchResults } = useSearchTeamStore();
    return(
        <>
            <p>검색결과</p>
            {searchResults.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                ) : (
                    <>
                        {searchResults.map((team) => (
                            <div key={team.id}>
                                <p>{team.teamName}</p>
                            </div>
                        ))}
                    </>
            )}
        </>
    );
}

export default SearchResultPage;