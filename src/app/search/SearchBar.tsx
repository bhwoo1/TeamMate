import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
    return(
        <div className="w-full mx-auto mb-4">
            <form className="w-full border p-2 rounded-lg bg-gray-100 flex flex-row">
                <input
                    type="text"
                    className="w-full bg-gray-100 focus:outline-none"
                    placeholder="당신의 팀을 검색해서 찾아보세요."
                />
                <button type="submit"><p className="p-2"><FaSearch /></p></button>
            </form>
        </div>
    );
}

export default SearchBar;