import { useState } from "react";
import axios from "axios";

function Login({ setUserId }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:21174/api/Recombee/GetUser/' + email);
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

    return(
    <div className="w-full h-full bg-white flex justify-center items-center relative">
        <img src="https://wallpapersok.com/images/hd/the-avengers-superhero-movie-eeotwqkmypkvalg9.jpg" className="w-full h-full object-cover"></img>
        <div className="w-[500px] h-fit bg-[#111827cc] absolute px-10 py-40 rounded-lg backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                <p className="text-5xl font-semibold text-white mb-16">UgaBuga</p>
                <div className="relative mb-6 w-full">
                    <input type="text"
                            id="default-search"
                            value={email}
                            onChange={handleEmailChange}
                            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none " placeholder="Email..." required="" />
                </div>
                <button className="w-full h-12 bg-blue-600 hover:bg-blue-800 transition-all duration-700 rounded-md shadow-xs text-white text-base font-semibold leading-6 mb-6"
                    type="submit"
                    disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign in'}
                </button>
            </form>
        </div>
    </div>)
}

export default Login;