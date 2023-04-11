import React from "react";
import { render } from "@testing-library/react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Contact = () => {

    return (
        <div>
            <h1>Contact page</h1>
        </div>
    );
};
export default Contact