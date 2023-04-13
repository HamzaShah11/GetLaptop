import React, { useState, useEffect } from "react";
import { db } from './firebase'
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import SignUp from "./Components/Signup";
import { collection, query, where, getDocs, addDoc, setDoc, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";
import "./Allusers.css"
import Modal from 'react-bootstrap/Modal';

const Profile = () => {
    const [UserId, setUserid] = useState("")
    const [newPassword, setPswd] = useState("")
    const [CnewPassword, setCPswd] = useState("")
    const [NewName, setNewName] = useState("")
    const [MyNewName, setName1] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [Email, setuser] = useState("")
    const [image, setImage] = useState("")
    const [imageurl, setImageURL] = useState("")
    const [Alldata, setData] = useState([])
    const [GetCurrentUser, setCuser] = useState("")
    const [name, setName] = useState('')
    const [ImageLink, setImagelink] = useState("")
    const [ForRerender, setForRerender] = useState(false)
    const auth = getAuth();
    const navigate = useNavigate();

    const handleShow = () => {
        setShow(true)
    };
    const uploadImage = async () => {
        const imageRef = ref(storage, new Date() + image.name);
        const snapshot = await uploadBytes(imageRef, image);
        const imageLink = await getDownloadURL(imageRef).then((res) => {
            console.log("res", res);
            setpics(res)
        })


    }
    const imageChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0])
    }

    function setpics(imagelinkk) {
        updateProfile(auth.currentUser, {
            photoURL: imagelinkk
        }).then((res) => {
            toast("test")
            setForRerender(true)
        }).catch((error) => {
            console.log(error);
        });

    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user == null) {
                navigate("/login")
            }
            if (user) {
                const uid = user.uid;
                const email = user.email;
                setUserid(user.uid)
                setuser(user.email)
                setImageURL(user.photoURL)

                let Email = email;
                let atIndex = Email.indexOf("@");
                let username = Email.substring(0, atIndex);

                setName(username)

            } else {
                console.log("user signed out");
            }
        });
        return unsubscribe;
    }, [ForRerender])

    const Getusers = async () => {
        var arr = [];
        const dataa = await getDocs(collection(db, "laptop"));
        dataa.forEach((doc) => {
            var obj = {
                id: doc.id,
                data: doc.data(),
            }
            // setData((prev) => [...prev,
            // {
            //     id: doc.id,
            //     data: doc.data(),
            // },
            // ]);
            // setData(obj)
            arr.push(obj)

        });
        Getusers()
        setData(arr)

    }

    const updateEmail = async () => {
        try {
            console.log("Email");
            updateEmail(auth.currentUser, newEmail).then(() => {
                toast("Email changed")
                console.log("password Changed");
            })

        } catch (er) {
            console.log(er);
        }
    }

    function setUserName() {
        updateProfile(auth.currentUser, {
            displayName: NewName
        }).then((res) => {
            toast("name updated")
            console.log(auth.currentUser);
            setName1(auth.currentUser.displayName)
        }).catch((error) => {
            console.log(error);
        });

    }
    const setUser = async () => {
        setCuser(auth.currentUser.email)
        setName1(auth.currentUser.displayName)

    }
    useEffect(() => {
        setUser()

    }, [auth])

    const handleReauthenticate = () => {


        const credential = EmailAuthProvider.credential(
            GetCurrentUser,
            password
        );

        reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
                if (newPassword == CnewPassword) {
                    updatePassword(auth.currentUser, newPassword).then(() => {
                        toast("password changed")
                        SignOut()
                    })
                } else {
                    toast("password do not match")
                }
                setError(null);
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };

    useEffect(() => {
        Getusers()
    }, [])
    useEffect(() => {
    }, [GetCurrentUser])


    useEffect(() => {
        // console.log("AllDAta", Alldata);
    }, [Alldata])

    useEffect(() => {
    }, [imageurl])

    function SignOut() {
        signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }




    return (
        <>
            <div className="header">
                <div className="headimg" ><img src="https://img.freepik.com/free-vector/creative-flat-laptop-logo-template_23-2149010230.jpg?w=2000" alt="Cinque Terre"></img></div>
                <div className="Para">
                    <p><a href="./SellLaptops">Sell Laptops</a></p>
                    <p><a href="./">Go to Shop</a></p>

                </div>

            </div>
            <div>
                <button onClick={SignOut}>Sign Out</button>
            </div>
            <div className="maindiv" style={{ margin: "auto", textAlign: "center", marginTop: "10px" }}>
                <h2>Welcome! {MyNewName}</h2>
                <div className="myimage">
                    {
                        imageurl == null ?
                            <div className="Noimage">
                                <label>
                                    <img src="https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9Ow0UBMLBaJrhygH.jpg" alt="Image description"></img>
                                    <input style={{ display: "none" }} type="file" onChange={imageChange} accept="image/*" />

                                </label>
                            </div> : <img src={imageurl} alt="My Image" placeholder="" />
                    }
                </div>
                <button className="updateprofile" style={{ marginTop: "10px" }} onClick={() => {
                    handleShow()
                }}>Change password</button>
                <div>
                    <lable>Update Name</lable>
                    <input type="text" onChange={(e) => setNewName(e.target.value)} />
                    <button onClick={() => setUserName(document.querySelector('input').value)}>Update Name</button>
                </div>

                <div>
                    <input type="file" onChange={imageChange} accept="image/*" />
                    <button onClick={uploadImage}>Upload Image</button>
                </div>

                <div className="currentuser">
                    <div>
                        <h3>User id</h3>
                        {UserId}
                    </div>
                    <div>
                        <h3>User Email</h3>
                        {Email}

                    </div>
                </div>



            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change password </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column">
                        <label> Old Password:</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <lable>New password</lable>
                        <input type="password" onChange={(e) => setPswd(e.target.value)} />
                        <lable>confrim password</lable>
                        <input type="password" onChange={(e) => setCPswd(e.target.value)} />
                        {error && <div>{error}</div>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button variant="secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button variant="primary" onClick={() => handleReauthenticate()}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>



            <div className="Footer">
                <div className="fpara">
                    <p>I am footer</p>
                </div>

            </div>
        </>

    );
};
export default Profile;
