import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ThumbsUp, Bookmark } from "lucide-react";
import TinderCard from "react-tinder-card";
import axios from "axios";

function Recommendations({userId}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [showPopup, setShowPopup] = useState(false);
  const [movies, setMovies] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [likes, setLikes] = useState([]);
  const [recommendationId, setRecommendationId] = useState("");
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [isGetNextRecommendationCalled, setisGetNextRecommendationCalled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingRecommendation(true);
      try {
        const response = await axios.get('http://localhost:21174/api/Recombee/GetRecommendation?userId=' + userId)
        setMovies(response.data.movies);
        setRecommendationId(response.data.recommendationId);
      } catch (err) {
        toast.error("An error occurred. Please try again later.");
        console.log(err)
      }
      setLoadingRecommendation(false);
    }
    fetchData();
  }, []);

  function processGenres(rawGenres) {
    try {
        let genresArray = JSON.parse(rawGenres);
        if (Array.isArray(genresArray)) {
            return genresArray.join(', ');
        } else {
            throw new Error('Parsed data is not an array');
        }
    } catch (error) {
        console.error('Invalid JSON string:', error.message);
    }
  }

  const getNextRecommendation = () => {
    setisGetNextRecommendationCalled(true);
    if (recommendationId === "" || recommendationId === null || recommendationId === undefined) {
      axios.get('http://localhost:21174/api/Recombee/GetRecommendation?userId=' + userId)
      .then((response) => {
        setMovies((currentMovies) => [...currentMovies, ...response.data.movies]);
        setRecommendationId(response.data.recommendationId);
        setisGetNextRecommendationCalled(false);
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again later.");
        console.log(err);
      });
    } else {
      axios.get('http://localhost:21174/api/Recombee/GetNextRecommendation?userId=' + userId + '&recommendationId=' + recommendationId)
        .then((response) => {
          setMovies((currentMovies) => [...currentMovies, ...response.data.movies]);
          setRecommendationId(response.data.recommendationId);
          setisGetNextRecommendationCalled(false);
        })
        .catch((err) => {
          toast.error("An error occurred. Please try again later.");
          console.log(err);
        });
    }
  }

  const getLikes = async () => {
    setLoadingLikes(true);
    await axios.get('http://localhost:21174/api/Recombee/GetLikes?userId=' + userId)
    .then((response) => {
      setLikes(response.data);
    })
    .catch((err) => {
      toast.error("An error occurred. Please try again later.");
      console.log(err);
    });
    setLoadingLikes(false);
  }

  const getBookmarks = async () => {
    setLoadingBookmarks(true);
    await axios.get('http://localhost:21174/api/Recombee/GetBookmarks?userId=' + userId)
    .then((response) => {
      setBookmarks(response.data);
    })
    .catch((err) => {
      toast.error("An error occurred. Please try again later.");
      console.log(err);
    });
    setLoadingBookmarks(false);
}

  const like = (movie) => {
    try {
      axios.post('http://localhost:21174/api/Recombee/AddLike', { userId: userId, movieId: movie.id });
    } catch (err) {
      console.log(err)
    }
  }
  
  const dislike = (movie) => {
    try {
      axios.post('http://localhost:21174/api/Recombee/AddDislike', { userId: userId, movieId: movie.id });
    } catch (err) {
      console.log(err)
    }
  }

  const bookmark = (movie) => {
    try {
      axios.post('http://localhost:21174/api/Recombee/AddBookmark', { userId: userId, movieId: movie.id });
    } catch (err) {
      console.log(err)
    }
  }

  const view = (movie) => {
    try {
      axios.post('http://localhost:21174/api/Recombee/AddView', { userId: userId, movieId: movie.id });
    } catch (err) {
      console.log(err)
    }
  }

  const handleSwipe = (direction, movie) => {
    setCurrentIndex(1 + currentIndex);

    if (movies.length - currentIndex < 7 && !isGetNextRecommendationCalled) {
      getNextRecommendation();
    }

    console.log(movies.length - currentIndex, !isGetNextRecommendationCalled);

    movie.hidden = true;

    if (direction === "right") {
      like(movie);
    } else if (direction === "left") {
      dislike(movie);
    } else if (direction === "down") {
      bookmark(movie);
    }
  };

  return (
    <div className={`flex flex-col items-center h-full w-full bg-gray-900 text-white ${activeTab === "recommendations" ? 'overflow-hidden' : 'overflow-x-auto'}`}>
      {/* Navbar */}
      <nav className="w-full bg-gray-800 p-4 flex justify-center">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "recommendations" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => {if (activeTab !== "recommendations") {setActiveTab("recommendations"); getNextRecommendation();}}}
        >
          Recommendations
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "bookmarks" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => {if (activeTab !== "bookmakrs") {setActiveTab("bookmarks"); getBookmarks();}}}
        >
          Bookmarks
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "likes" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => {if (activeTab !== "likes") {setActiveTab("likes"); getLikes();}}}
        >
          Likes
        </button>
      </nav>

      {/* Content */}
      {activeTab === "recommendations" && (
        <div className="w-full h-full flex justify-center items-center flex-col gap-5">
          {loadingRecommendation ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="w-full h-fit flex justify-center items-center gap-5">
                <div className="w-32 h-32 bg-red-600 rounded-full flex justify-center items-center">
                  <ThumbsUp className="w-1/2 h-1/2 rotate-180"></ThumbsUp>
                </div>
                <div className="relative w-[450px] h-[600px] mt-8">
                  {movies.slice().reverse().map((movie, index) => (
                    <TinderCard
                      swipeRequirementType="position"
                      swipeThreshold={100}
                      preventSwipe={['up']}
                      key={movie.id + "-" + index}
                      className={"absolute w-full h-full " + (movie.hidden === true ? "hidden" : "")}
                      onSwipe={(dir) => handleSwipe(dir, movie)}
                    >
                      <div
                        className="relative w-full h-full bg-cover bg-center rounded-xl shadow-lg"
                        style={{ backgroundImage: `url(${movie.posterPath})` }}
                      >
                        <div className="absolute bottom-0 w-full bg-gray-900 bg-opacity-90 p-6 rounded-b-xl">
                          <h2 className="text-3xl font-bold mb-2 text-center">{movie.title}</h2>
                          <p className="text-sm mb-4 text-center">
                            {movie.description.slice(0, 50)}...
                          </p>
                          <div className=" flex justify-between">
                            <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                              <img
                                className="w-16"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png"
                                alt="IMDb Logo"
                              />
                              {movie.imdbRating}
                            </div>
                            <button
                              className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              onClick={() => {
                                setShowPopup(true);
                                view(movie);
                              }}
                            >
                              View More
                            </button>
                            <div className="flex items-center gap-2 flex-row-reverse w-1/3 max-w-[33%]">
                              <img
                                className="w-16"
                                src="https://lh5.googleusercontent.com/proxy/jc4HSd6hDlsNSMX3a-z5QnB_gfTwkSa6U2l1UC8qfaJZEqrc0VC2t4vMc0JJ3OH8cEviXFjnUYspyRhzCirvAMxVT54BV5cqgzv2BmRtC_eNteHZ"
                                alt="TMDb Logo"
                              />
                              <p>{movie.tmdbRating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TinderCard>
                  ))}
                </div>
                <div className="w-32 h-32 bg-green-600 rounded-full flex justify-center items-center">
                  <ThumbsUp className="w-1/2 h-1/2"></ThumbsUp>
                </div>
              </div>
              <div className="w-32 h-32 bg-blue-600 rounded-full flex justify-center items-center">
                <Bookmark className="w-1/2 h-1/2"></Bookmark>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "bookmarks" && (
        <div className="w-[1300px] bg-gray-800 bg-opacity-80 rounded-lg p-4 mt-8">
          <h3 className="text-2xl font-bold mb-8">Bookmarks</h3>
          {loadingBookmarks}
          {loadingBookmarks ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-none p-0 flex flex-col gap-12">
              {bookmarks.length > 0 ? (
                bookmarks.map((movie, index) => (
                  <li key={movie.id + '-' + index} className="w-full flex gap-10">
                    <div className="w-[200px] min-w-[200px] h-[300px] min-h-[300px]">
                      <div
                        className="relative w-full h-full bg-cover bg-center rounded-xl shadow-lg"
                        style={{ backgroundImage: `url(${movie.posterPath})` }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-4 text-2xl font-bold">{movie.title}</p>
                      <p className="mb-4">{movie.description}</p>
                      <p className="mb-4">Genres: {processGenres(movie.genres)}</p>
                      <div className="flex flex-col mb-4 gap-4">
                        <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                          <img
                            className="w-16"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png"
                            alt="IMDb Logo"
                          />
                          {movie.imdbRating}
                        </div>
                        <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                          <img
                            className="w-16"
                            src="https://lh5.googleusercontent.com/proxy/jc4HSd6hDlsNSMX3a-z5QnB_gfTwkSa6U2l1UC8qfaJZEqrc0VC2t4vMc0JJ3OH8cEviXFjnUYspyRhzCirvAMxVT54BV5cqgzv2BmRtC_eNteHZ"
                            alt="TMDb Logo"
                          />
                          <p>{movie.tmdbRating}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No bookmarks yet.</p>
              )}
            </ul>
          )}
        </div>
      )}

      {activeTab === "likes" && (
        <div className="w-[1300px] bg-gray-800 bg-opacity-80 rounded-lg p-4 mt-8">
          <h3 className="text-2xl font-bold mb-8">Likes</h3>
          {loadingLikes ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-none p-0 flex flex-col gap-12">
              {likes.length > 0 ? (
                likes.map((movie, index) => (
                  <li key={movie.id + '-' + index} className="w-full flex gap-10">
                    <div className="w-[200px] min-w-[200px] h-[300px] min-h-[300px]">
                      <div
                        className="relative w-full h-full bg-cover bg-center rounded-xl shadow-lg"
                        style={{ backgroundImage: `url(${movie.posterPath})` }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-4 text-2xl font-bold">{movie.title}</p>
                      <p className="mb-4">{movie.description}</p>
                      <p className="mb-4">Genres: {processGenres(movie.genres)}</p>
                      <div className="flex flex-col mb-4 gap-4">
                        <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                          <img
                            className="w-16"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png"
                            alt="IMDb Logo"
                          />
                          {movie.imdbRating}
                        </div>
                        <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                          <img
                            className="w-16"
                            src="https://lh5.googleusercontent.com/proxy/jc4HSd6hDlsNSMX3a-z5QnB_gfTwkSa6U2l1UC8qfaJZEqrc0VC2t4vMc0JJ3OH8cEviXFjnUYspyRhzCirvAMxVT54BV5cqgzv2BmRtC_eNteHZ"
                            alt="TMDb Logo"
                          />
                          <p>{movie.tmdbRating}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No likes yet.</p>
              )}
            </ul>
          )}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-8 rounded-lg w-[600px]">
            <h2 className="text-2xl font-bold mb-4">{movies[currentIndex].title}</h2>
            <p className="mb-4">{movies[currentIndex].description}</p>
            <p className="mb-4">Genres: {processGenres(movies[currentIndex].genres)}</p>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2 w-1/3 max-w-[33%]">
                <img className="w-16 " src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png"></img>
                {movies[currentIndex].imdbRating}
              </div>
              <div className="flex items-center gap-2 flex-row-reverse w-1/3 max-w-[33%]">
                <img className="w-16 " src="https://lh5.googleusercontent.com/proxy/jc4HSd6hDlsNSMX3a-z5QnB_gfTwkSa6U2l1UC8qfaJZEqrc0VC2t4vMc0JJ3OH8cEviXFjnUYspyRhzCirvAMxVT54BV5cqgzv2BmRtC_eNteHZ"></img>
                <p>{movies[currentIndex].tmdbRating}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;



