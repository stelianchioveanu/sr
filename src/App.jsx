import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Recommendations from "./components/Recommendations";
import { ToastContainer } from "react-toastify";

function App() {
  const [userId, setUserId] = useState(null);

  const updateUserId = (id) => {
    setUserId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen min-h-screen min-w-screen bg-gray-900 text-white overflow-hidden">
      <ToastContainer />
      {userId === null ? <Login setUserId={updateUserId}></Login> : <></>}
      {userId === "" ? <Register setUserId={updateUserId}></Register> : <></>}
      {userId !== "" && userId != null ?
      <Recommendations userId={userId}></Recommendations> : <></>}
    </div>
  );
}

export default App;



