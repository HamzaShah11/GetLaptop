import React from "react";
import { db, storage } from '../firebase'
import { useEffect, useState } from 'react'
import { collection, addDoc, Timestamp, getDocs, query, where, updateDoc, doc, deleteField, deleteDoc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import Modal from 'react-bootstrap/Modal';
import images from "../assets/IMAGES/productImage.png"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Admin = () => {
    const auth = getAuth()
    const Navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("")
    const [quantity, setQuantity] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [GetLaptopData, setLaptopData] = useState([]);
    const [myobj, setmyobj] = useState({});
    const [item, setCurrentItem] = useState("");
    const [UpdateName, setUpdateLaptopName] = useState("");
    const [UpdatePrice, setUpdateLaptopPrice] = useState("");
    const [UpdateQuantity, setUpdateLaptopQuantity] = useState("");
    const [UpdateImage, setUpdateLaptopImage] = useState("");
    const [show, setShow] = useState(false);
    const [ForRerender, setForRerender] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = (id, item) => {
        setmyobj({ id })
        setCurrentItem(item.data)
        setUpdateLaptopName(item.data.LaptopName)
        setUpdateLaptopPrice(item.data.LaptopPrice)
        setUpdateLaptopQuantity(item.data.LaptopQuantity)
        setUpdateLaptopImage(item.data.LaptopImage)
        setShow(true)

    };

    const handleAdmin = async () => {
        try {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const q = query(collection(db, "users"), where("Useremail", "==", user.email), where("isAdmin", "==", true));
                    const querySnapshot = await getDocs(q);
                    console.log(querySnapshot)
                    if (querySnapshot.empty) {
                        Navigate("/Allusers");
                    } else {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, " => ", doc.data());
                            if (doc.data().isAdmin == true) {
                                setIsAdmin(true)
                            }
                            else {
                                console.log("Else")
                                Navigate("/Allusers");
                            }
                        });
                    }
                } else {
                    Navigate("/login");
                }

            });
            return unsubscribe;

        } catch (error) {
            console.log(error.code)
            console.log(error.message)
            toast(error.message)

        }
    };

    const imageChange = async (e) => {
        console.log(e.target.files[0]);
        const imageRef = ref(storage, new Date() + e.target.files[0].name);
        const snapshot = await uploadBytes(imageRef, e.target.files[0]);
        const imageLink = await getDownloadURL(imageRef).then((res) => {
            console.log("res", res);
            setImage(res)

        })

    }


    async function Addlaptops() {

        try {
            if (price <= 0 || quantity <= 0) {
                toast("value should be greater then 0")
            }
            else {
                if (image == "") {
                    toast("Let the image to be uploaded")
                } else {
                    const docRef = await addDoc(collection(db, "laptop"), {
                        LaptopName: name,
                        LaptopPrice: Number(price),
                        LaptopQuantity: Number(quantity),
                        laptopImage: image,
                    });
                    console.log(docRef.data);
                    toast("Laptop Added")
                    console.log("Document written with ID: ", docRef.id);
                    GetLaptop()
                }

            }

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function updateLaptops() {
        try {
            if (UpdatePrice <= 0 || UpdateQuantity <= 0) {
                toast("value should be greater then 0")
            } else {
                const docRef = doc(db, "laptop", myobj.id);

                await updateDoc(docRef, {
                    LaptopName: UpdateName,
                    LaptopPrice: Number(UpdatePrice),
                    LaptopQuantity: Number(UpdateQuantity),
                    laptopImage: image
                }, { merge: true });
                toast("Updated SucessFully")
                GetLaptop()
            }

        } catch (er) {
            console.log(er);
        }
    }

    const GetLaptop = async () => {
        const dataa = await getDocs(collection(db, "laptop"));
        setLaptopData([])
        dataa.forEach((doc) => {
            setLaptopData((prev) => [...prev,
            {
                id: doc.id,
                data: doc.data(),
            },
            ]);
        });
    }

    const DeleteLaptop = async (id) => {
        console.log("id", id);
        await deleteDoc(doc(db, "laptop", id));
        GetLaptop()
        toast("laptop deleted")

    }

    useEffect(() => {
        handleAdmin()
    }, [])
    useEffect(() => {
        GetLaptop()

    }, [])

    useEffect(() => {
        console.log("All Laptop Data", GetLaptopData);
    }, [GetLaptopData])

    function abc() {
        signOut(auth).then(() => {
            Navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }



    if (!isAdmin) {
        return <></>
    } else {
        return (
            <>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Laptop </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-column">

                            <label>Name</label>
                            <input type="text" value={UpdateName} onChange={(e) => setUpdateLaptopName(e.target.value)} />
                            <lable>price</lable>
                            <input type="number" value={UpdatePrice} onChange={(e) => setUpdateLaptopPrice(e.target.value)} />
                            <lable>Quantity</lable>
                            <input type="number" value={UpdateQuantity} onChange={(e) => setUpdateLaptopQuantity(e.target.value)} />

                            <label >Add Image <img className="MyinputFile1" src={images} alt="upload image" />
                                <input className="MyinputFile" type="file" onChange={imageChange} accept="image/*" /></label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button variant="secondary" onClick={handleClose}>
                            Close
                        </button>
                        <button variant="primary" onClick={() => updateLaptops()}>
                            Save Changes
                        </button>
                    </Modal.Footer>
                </Modal>

                <div className="AdminHeader">
                    <p>Admin page</p>
                    <button onClick={abc}>Sign Out</button>

                </div>

                <div className="AddItems">
                    <div>

                        <lable>laptop_name</lable>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <lable>laptop_price</lable>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        <lable>Quantity</lable>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                        <label >Add Image <img className="MyinputFile1" src={images} alt="upload image" />
                            <input className="MyinputFile" type="file" onChange={imageChange} accept="image/*" /></label>

                    </div>

                    <div>


                        <button onClick={Addlaptops}>Add Product</button>
                    </div>

                </div>

                <div className="LaptopTableData">
                    <div>
                        <h1>Laptop List</h1>
                        <table >
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {GetLaptopData.length > 0 ?
                                    GetLaptopData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{item.id}</td>
                                            <td>{item.data.LaptopName}</td>
                                            <td>{item.data.LaptopPrice}</td>
                                            <td>{item.data.LaptopQuantity}</td>
                                            <div className="myimage">
                                                {
                                                    item.data.laptopImage == null ?
                                                        <div className="Noimage">
                                                            <label>
                                                                <img src="https://t3.ftcdn.net/jpg/02/18/21/86/360_F_218218632_jF6XAkcrlBjv1mAg9Ow0UBMLBaJrhygH.jpg" alt="Image description"></img>
                                                                <input style={{ display: "none" }} type="file" onChange={imageChange} accept="image/*" />

                                                            </label>
                                                        </div> : <img src={item.data.laptopImage} alt="My Image" placeholder="" />
                                                }

                                            </div>
                                            <td>
                                                <button onClick={() => {
                                                    handleShow(item.id, item)
                                                }}>update</button>
                                                <button onClick={() => DeleteLaptop(item.id)}>delete</button>
                                            </td>

                                        </tr>
                                    ))
                                    : <></>
                                }



                            </tbody>
                        </table>

                    </div>
                </div>




            </>

        );
    }
};
export default Admin