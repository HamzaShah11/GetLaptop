import React, { useState, useEffect } from "react";
import { db } from './firebase'
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import SignUp from "./Components/Signup";
import { collection, query, where, getDocs, addDoc, setDoc, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";
import "./Allusers.css"


const AllUsers = () => {
    const [UserId, setUserid] = useState("")
    const [purchas, setpurchas] = useState("")
    const [Email, setuser] = useState("")
    const [image, setImage] = useState("")
    const [imageurl, setImageURL] = useState("")
    const [Alldata, setData] = useState([])
    const [GetCurrentUser, setCuser] = useState("")
    const [purchasedLaptops, setPurchaseLaptopData] = useState([])
    const [name, setName] = useState('')
    const [ImageLink, setImagelink] = useState("")
    const [ForRerender, setForRerender] = useState(false)
    const auth = getAuth();
    const navigate = useNavigate();

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
            displayName: name, photoURL: imagelinkk

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
                console.log(imageurl);
                console.log("Alldata", Alldata);
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

    const setUser = async () => {
        setCuser(auth.currentUser.email)
        setName(auth.currentUser.displayName)
    }
    useEffect(() => {
        setUser()
    })

    const GetbuyLaptop = async () => {
        try {
            console.log("GetCurrentUser", GetCurrentUser);
            const docSnap = await getDoc(doc(db, "purchasedLaptops", GetCurrentUser))
            if (docSnap.exists()) {
                console.log(docSnap.data());
                setPurchaseLaptopData(docSnap.data())

            } else {
                console.log("No such document!");
            }

        } catch (er) {
            console.log(er);

        }
    }


    useEffect(() => {
        Getusers()
    }, [])
    useEffect(() => {
        GetbuyLaptop()
    }, [GetCurrentUser])

    useEffect(() => {
        console.log("purchhased laptops", purchasedLaptops);

    }, [purchasedLaptops])

    useEffect(() => {
        // console.log("AllDAta", Alldata);
    }, [Alldata])

    useEffect(() => {
    }, [imageurl])

    function abc() {
        signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }

    async function buy(id, quantityy, ProductImage, specss) {
        let data = {}
        console.log("quantity", quantityy);
        let qet = quantityy - 1
        if (qet >= 0) {
            await setDoc(doc(db, "purchasedLaptops", auth.currentUser.email), {

                [id]: { quantitys: increment(1), Image: ProductImage, spec: specss }
            }, { merge: true }).then(() => {
                toast("laptop: " + ": " + id + "purchased")
                GetbuyLaptop()
            });
            updateLaptops(id, qet)
        } else {
            toast("stock finished")
        }
    }

    async function updateLaptops(id, qet) {
        try {
            const docRef = doc(db, "laptop", id);
            await updateDoc(docRef, {
                LaptopQuantity: Number(qet)
            }, { merge: true });
        } catch (er) {
            console.log(er);
        }
    }


    return (
        <>
            <div className="header">
                <div className="headimg" ><img src="https://img.freepik.com/free-vector/creative-flat-laptop-logo-template_23-2149010230.jpg?w=2000" alt="Cinque Terre"></img></div>
                <div className="Para">
                    <p><a href="./SellLaptops">Become a Seller</a></p>
                    <p><a href="./Profile">Update Proifle</a></p>
                </div>
            </div>
            <div>
                <button onClick={abc}>Sign Out</button>
            </div>
            <div className="maindiv" style={{ margin: "auto", textAlign: "center", marginTop: "1px" }}>
                <h2>Welcome! {name}
                </h2>

                <div className="laptopsss">
                    <h1>New items</h1>

                </div>
                <div className="cardWraper">
                    {Alldata.length > 0 ?
                        Alldata.map((item, index) => (
                            <div className="card">
                                <img className="img-fluid" src={item.data.laptopImage} alt="" />
                                <div>
                                    <p><span>Model: </span>{item.id}</p>
                                    <p><span>Left in store: </span>{item.data.LaptopQuantity}</p>
                                    <p><span>Name: </span>{item.data.LaptopName}</p>
                                    <p><span>Specs: </span>{item.data.LaptopSpecs}</p>
                                    <p><span>Price: </span>{item.data.LaptopPrice}</p>
                                    <button onClick={() => buy(item.id, item.data.LaptopQuantity, item.data.laptopImage, item.data.LaptopSpecs,)}>Buy Laptop</button>
                                </div>
                            </div>
                        )) : <></>
                    }

                </div>
                {/* <div className="TableData">
                    <div>
                        <h1>All Laptops</h1>
                        <table >
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th> Model</th>
                                    <th> Name</th>
                                    <th> Specs</th>
                                    <th> Price</th>
                                    <th> Image</th>
                                    <th> left in store</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Alldata.length > 0 ?

                                    Alldata.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{item.id}</td>
                                            <td>{item.data.LaptopName}</td>
                                            <td>{item.data.LaptopSpecs}</td>
                                            <td>{item.data.LaptopPrice}</td>
                                            <div className="mylaptopimage">
                                                {
                                                    item.data.laptopImage == null ?
                                                        <div className="Noimage">
                                                            <label>
                                                                <img src="https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9Ow0UBMLBaJrhygH.jpg" alt="Image description"></img>


                                                            </label>
                                                        </div> : <img src={item.data.laptopImage} alt="My Image" placeholder="" />
                                                }

                                            </div>
                                            <td>{item.data.LaptopQuantity}</td>
                                            <td><button onClick={() => buy(item.id, item.data.LaptopQuantity, item.data.laptopImage, item.data.LaptopSpecs,)}>Buy Laptop</button></td>
                                        </tr>
                                    ))
                                    : <></>
                                }

                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>
            {/* <div className="TableData">
                <div>
                    <h1>Purchased Laptops</h1>
                    <table >
                        <thead>
                            <tr>

                                <th>laptop id</th>
                                <th>Specs</th>
                                <th>Quantity</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        {
                            <tbody>

                                {purchasedLaptops ?
                                    Object.entries(purchasedLaptops).map(([key, value]) => (
                                        <tr>

                                            <td>{key}</td>
                                            <td>{value.spec}</td>
                                            <td>{value.quantitys}</td>
                                            <td><img src={value.Image} alt="" /></td>

                                        </tr>
                                    ))
                                    : <></>
                                }

                            </tbody>}
                    </table>
                </div>
            </div> */}
            <div className="laptopsss">
                <h1>Purchased laptops</h1>

            </div>
            <div className='cardWraper'>
                {purchasedLaptops ?
                    Object.entries(purchasedLaptops).map(([key, value]) => (
                        <div className='card ' >

                            <img className='img-fluid' src={value.Image} alt="img" />
                            <div>
                                <p> <span> Model: </span> {"   " + key}</p>
                                <p><span>Spec: </span>{"   " + value.spec}</p>
                                <p><span>quantity: </span>{"   " + value.quantitys}</p>

                            </div>
                        </div>
                    ))
                    : <></>
                }

            </div>
            <div className="Footer">
                <div className="fpara">
                    <p>I am footer</p>
                </div>

            </div>
        </>

    );
};
export default AllUsers;
