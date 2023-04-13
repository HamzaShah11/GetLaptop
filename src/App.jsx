import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import SignUp from "./Components/Signup";
import Login from "./Components/login";
import AllUsers from "./Allusers";
import Admin from "./Components/Admin";
import SellLaptops from "./Components/SellLaptops";
import Profile from "./profile";


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AllUsers" element={<AllUsers />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/SellLaptops" element={<SellLaptops />} />
        <Route path="/Profile" element={<Profile />} />


      </Routes>

    </div>
  );
};
export default App;
