import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useMutation } from "react-query";
import { useSearchPostStore } from "../zustand/store";

const submitKeyword = async ({ keyword, category, teamID }: { keyword: string, category: string, teamID: number }) => {
    console.log(keyword);
    const response = await axios.post("/api/search/post", {
        keyword: keyword
    }, {
        headers: {
            category: category,
            teamID: teamID
        }
    });
    return response.data;
}

const PostSearchBar = ({teamID}: {teamID: number}) => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [category, setCategory] = useState<string>("tico");
    const { setSearchResults } = useSearchPostStore();
    const router = useRouter();

    const submitKeywordMutation = useMutation(submitKeyword, {
        onSuccess: (data) => {
            setSearchResults(data);
            setSearchKeyword("");
            router.push(`/team/${teamID}/search/${searchKeyword}`);
        },
        onError: (error: AxiosError) => {
            alert('검색에 실패했습니다!');
            console.log("Search request failed:", error.message);
        }
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (searchKeyword === "") {
            alert('검색어를 입력해주세요!')
        }
        else {
            submitKeywordMutation.mutate({keyword: searchKeyword, category: category, teamID: teamID});
        }

    }
    
    return(
        <div className="w-2/3 mx-auto mb-4 flex items-center">
            <form onSubmit={(e) => handleSubmit(e)} className="w-full border p-2 rounded-lg bg-gray-100 flex flex-row">
                <select className="form-select form-select-sm w-1/4 bg-gray-100" onChange={(e) => setCategory(e.target.value)}>
                    <option selected value={'tico'}>제목+본문</option>
                    <option value={'title'}>제목</option>
                    <option value={'content'}>본문</option>
                    <option value={'user'}>작성자</option>
                </select>
                <input 
                    type="text"
                    className="w-full bg-gray-100 focus:outline-none"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요."
                />
                <button type="submit"><p className="p-2"><FaSearch /></p></button>
            </form>
        </div>
    );
}

export default PostSearchBar;