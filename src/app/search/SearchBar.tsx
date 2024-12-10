import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useMutation } from "react-query";
import { useSearchTeamStore } from "../zustand/store";

const submitKeyword = async ({ keyword }: { keyword: string }) => {
    const response = await axios.post("/api/search/team", {
        data: {
            keyword: keyword
        }
    });
    return response.data;
}

const SearchBar = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const { setSearchResults } = useSearchTeamStore();
    const router = useRouter();

    const submitKeywordMutation = useMutation(submitKeyword, {
        onSuccess: (data) => {
            setSearchResults(data);
        },
        onError: (error: AxiosError) => {
            console.error("Search request failed:", error.response?.data || error.message);
        }
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        submitKeywordMutation.mutate({keyword: searchKeyword});
    }
    
    return(
        <div className="w-full mx-auto mb-4">
            <form onSubmit={(e) => handleSubmit(e)} className="w-full border p-2 rounded-lg bg-gray-100 flex flex-row">
                <input
                    type="text"
                    className="w-full bg-gray-100 focus:outline-none"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="당신의 팀을 검색해서 찾아보세요."
                />
                <button type="submit"><p className="p-2"><FaSearch /></p></button>
            </form>
        </div>
    );
}

export default SearchBar;