import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import SignUp from "./Components/Signup";
import Login from "./Components/login";
import AllUsers from "./Allusers";
import Contact from "./Components/Contact";
import Admin from "./Components/Admin";
// import 'bootstrap/dist/css/bootstrap.css';


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AllUsers" element={<AllUsers />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>

    </div>
  );
};
export default App;
