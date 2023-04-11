import { db } from '../firebase'
import React, { useEffect, useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { async } from '@firebase/util';
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();


    const handleSignUp = async (e) => {

        e.preventDefault();
        try {
            saveuser()
            const { user } = await createUserWithEmailAndPassword(auth, email, password).then(res => {
                console.log("User Signed up sucessfully");

                toast("User Registered")

                signOut(auth).then(() => {
                    navigate("/")
                }).catch((error) => {
                    console.log(error);
                });
                navigate("/login");
            }).catch(error => {

                console.log(error.code)
                console.log(error.message)
                toast(error.code)
            });

        } catch (error) {

        }
    };
    const abc = () => {
        navigate("/login")
    }

    async function saveuser() {
        try {
            console.log("save user function called");
            const docRef = await addDoc(collection(db, "users"), {
                Useremail: email,
                Userpassword: password,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    onAuthStateChanged(auth, (user) => {
        if (auth.currentUser != null) {
            navigate("/AllUsers")
        }
    });



    return (

        <div style={{ margin: "auto", textAlign: "center" }}>
            <h1>Please Signup</h1>
            <form onSubmit={handleSignUp}>
                <lable>Email</lable>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <lable>Password</lable>
                <input ty pe="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign Up</button>
            </form>
            <div style={{ marginTop: "20px", marginRight: "20px" }}>
                <p>Already have account?</p>
                <button onClick={abc}>Login</button>
            </div>
        </div>

    );
};
export default SignUp