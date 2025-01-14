import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import SearchWithFilter from "./SearchWithFilter";
import { toast } from "react-toastify";

function Register({ setUserId }) {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const genres = [
        "Action",
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "History",
        "Horror",
        "Music",
        "Mystery",
        "Romance",
        "Science Fiction",
        "Thriller",
        "TV Movie",
        "War",
        "Western",
      ];

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [ids, setIds] = useState([]);

    const handleCheckboxChange = (e) => {
        const genre = e.target.name;
        if (e.target.checked) {
            setSelectedGenres((prev) => [...prev, genre]);
        } else {
            setSelectedGenres((prev) => prev.filter((g) => g !== genre));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:21174/api/Recombee/AddNewUser', {email: email, fullName: fullName, genres: selectedGenres, favMovies: ids});
            setUserId(response.data);
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    return(
    <div className="w-full h-full bg-white flex justify-center items-center relative">
        <img src="https://wallpapers.com/images/hd/thor-hollywood-movie-cds1dwi0pfs58szg.jpg" className="w-full h-full object-cover"></img>
        <div className="w-[500px] h-fit bg-[#111827cc] absolute px-10 py-16 rounded-lg backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                <p className="text-5xl font-semibold text-white mb-16">UgaBuga</p>
                <div className="relative mb-6 w-full">
                    <input type="text"
                            id="default-search"
                            value={fullName}
                            onChange={handleFullNameChange}
                            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none " placeholder="Full name..." required="" />
                </div>
                <div className="relative mb-6 w-full">
                    <input type="text"
                            id="default-search"
                            value={email}
                            onChange={handleEmailChange}
                            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none " placeholder="Email..." required="" />
                </div>
                <SearchWithFilter setIds={setIds}></SearchWithFilter>
                <div className="w-full relative grid grid-cols-3 gap-2 mb-6">
                    {genres.map((genre, index) => (
                        <div className="flex" key={index}>
                        <input
                            id={`checkbox-group-${index + 1}`}
                            type="checkbox"
                            name={genre}
                            className="w-5 h-5 cursor-pointer appearance-none border border-gray-300 rounded-md mr-2 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor={`checkbox-group-${index + 1}`}
                            className="text-sm font-normal cursor-pointer text-white"
                        >
                            {genre}
                        </label>
                        </div>
                    ))}
                </div>
                <button className="w-full h-12 bg-blue-600 hover:bg-blue-800 transition-all duration-700 rounded-md shadow-xs text-white text-base font-semibold leading-6 mb-6"
                    type="submit"
                    disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Register'}
                </button>
            </form>
        </div>
    </div>)
}

export default Register;