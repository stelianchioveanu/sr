import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Importăm iconița X din lucide-react
import { toast } from "react-toastify";

const SearchWithFilter = ({ setIds }) => {  // Adăugăm setIds ca prop
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]); // Listă pentru filmele selectate
  const [loading, setLoading] = useState(false); // State pentru loading
  const [showResults, setShowResults] = useState(false); // State pentru a arăta rezultatele
  const resultsRef = useRef(null); // Ref pentru pop-up
  const inputRef = useRef(null); // Ref pentru inputul de căutare

  // Funcție pentru a face cererea către server
  const fetchData = async (term) => {
    setLoading(true); // Pornim loading-ul
    try {
      const response = await axios.get(
        `http://localhost:21174/api/Recombee/GetMovie?search=${term}`
      );
      setData(response.data); // Setează rezultatele
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Oprirea loading-ului
    }
  };

  // Efect pentru a declanșa căutarea la schimbarea inputului
  useEffect(() => {
    if (searchTerm === "") {
      setData([]); // Resetăm datele dacă searchTerm este gol
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchData(searchTerm); // Apelăm fetchData cu searchTerm
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Funcție pentru a adăuga un film în lista de selecții
  const handleSelectMovie = (movie) => {
    // Verificăm dacă filmul nu este deja în lista selectedMovies
    if (!selectedMovies.some((selectedMovie) => selectedMovie.id === movie.id)) {
      setSelectedMovies((prevSelectedMovies) => [...prevSelectedMovies, movie]);
      setIds([...selectedMovies.map((movie) => movie.id), movie.id]); // Apelăm setIds cu ID-urile actualizate
    }

    // Resetăm searchTerm și închidem pop-up-ul după selecție
    setSearchTerm(""); // Ștergem textul din input
    setData([]); // Goliți rezultatele
    setShowResults(false); // Închidem pop-up-ul
  };

  // Funcție pentru a șterge un film din lista de selecții
  const handleRemoveMovie = (movieId) => {
    const updatedMovies = selectedMovies.filter((movie) => movie.id !== movieId);
    setSelectedMovies(updatedMovies);
    setIds(updatedMovies.map((movie) => movie.id)); // Apelăm setIds cu ID-urile actualizate
  };

  // Închiderea pop-up-ului dacă se face click în afacerea acestuia
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-6 w-full">
      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true); // Arătăm rezultatele în timp ce se scrie
        }}
        className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
        placeholder="Search for movies..."
      />

      {/* Pop-up pentru rezultate */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : (
            <>
              <ul>
                {data.map((item) => (
                  <li
                    key={item.id}
                    className="cursor-pointer p-3 hover:bg-gray-100 text-black"
                    onClick={() => handleSelectMovie(item)} // Când se face click pe un film, îl adăugăm în lista de selecții
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className="w-full mt-5"> {/* Adăugăm mt-5 pentru marginea de sus */}
        <h3 className="text-xl text-white mb-3">Selected Movies:</h3>
        <ul className="text-white gap-5 flex flex-col"> {/* Adăugăm gap-5 pentru spațiu mai mare între elemente */}
          {selectedMovies.map((movie) => (
            <li key={movie.id} className="flex justify-between items-center gap-2"> {/* Adăugăm gap-2 între titlu și iconița X */}
              <span>{movie.title}</span>
              <button
                onClick={() => handleRemoveMovie(movie.id)} // Ștergem filmul din lista de selecții
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} /> {/* Iconița X din lucide-react */}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchWithFilter;
