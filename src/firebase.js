import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAS5Fqp-r9NJbTqSLpGtcYCHdvC0B3CUQ4",
  authDomain: "signup-8d3d3.firebaseapp.com",
  projectId: "signup-8d3d3",
  storageBucket: "signup-8d3d3.appspot.com",
  messagingSenderId: "281604640987",
  appId: "1:281604640987:web:1e205f2e7f8888f3973cfe"
};
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth, storage }