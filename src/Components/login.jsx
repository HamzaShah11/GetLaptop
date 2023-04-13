
import { render } from "@testing-library/react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  console.log("current user", auth.currentUser)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const q = query(collection(db, "users"), where("isAdmin", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        if (doc.data().Useremail == email) {
          navigate("/Admin")
        }
        else {
          navigate("/Allusers");
        }
      });
      console.log("loign sucessfull");
    } catch (error) {
      console.log(error.code)
      console.log(error.message)
      toast(error.message)

    }
  };


  const abc = () => {
    navigate("/")
  }
  onAuthStateChanged(auth, (user) => {
    if (auth.currentUser != null) {
      navigate("/AllUsers")
    }
  });
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h1>Login User</h1>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Want to register?</p>
        <button onClick={abc}>signUp</button>
      </div>
    </div>
  );
};
export default Login