
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import "./seller.css"
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const SellLaptops = () => {
    const navigate = useNavigate()
    const [GetCurrentUser, setCurrentUser] = useState("")
    const [GetPurchasedLaptopData, setPurchaseLaptopData] = useState("")


    const GetbuyLaptop = async () => {
        console.log("getcurrent user");
        try {

            const docSnap = await getDoc(doc(db, "purchasedLaptops", GetCurrentUser))
            if (docSnap.exists()) {

                setPurchaseLaptopData(docSnap.data())

            } else {
                console.log("No such document!");
            }

        } catch (er) {
            console.log(er);

        }
    }
    function abcd() {
        console.log(GetPurchasedLaptopData, "get data");
    }
    onAuthStateChanged(auth, (user) => {
        if (auth.currentUser != null) {
            const curentuser = auth.currentUser.email;
            setCurrentUser(curentuser)
        }
        else {
            navigate("/login")
        }
    });

    useEffect(() => {
        GetbuyLaptop()

    }, [GetCurrentUser])

    useEffect(() => {
        abcd()
    }, [GetPurchasedLaptopData])

    function signoutt() {
        console.log("signout function called");
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
                    <p><a href="./Allusers">Go to Shop</a></p>
                    <p><a href="./Profile">Update profile</a></p>
                </div>

            </div>
            <div className='Signout'>
                <button onClick={signoutt}>Sign Out</button>
            </div>

            <div className='cardWraper'>
                {GetPurchasedLaptopData ?
                    Object.entries(GetPurchasedLaptopData).map(([key, value]) => (
                        <div className='card ' >

                            <img className='img-fluid' src={value.Image} alt="img" />
                            <div>

                                <p> <span> ID</span> {"   " + key}</p>
                                <p><span>Spec</span>{"   " + value.spec}</p>
                                <p><span>quantity</span>{"   " + value.quantitys}</p>
                                <button onClick={abcd}>sell laptop</button>
                            </div>
                        </div>
                    ))
                    : <></>
                }

            </div>


            {/* <div className="TableData">
                <div>
                    <h1>Sell Your Laptops </h1>

                    <table >
                        <thead>
                            <tr>
                                <th>laptop id</th>
                                <th>specs</th>
                                <th>Quantity</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        {
                            <tbody>

                                {GetPurchasedLaptopData ?
                                    Object.entries(GetPurchasedLaptopData).map(([key, value]) => (
                                        <tr>

                                            <td>{key}</td>
                                            <td>{value.spec}</td>
                                            <td>{value.quantitys}</td>
                                            <td><img src={value.Image} alt="" /></td>
                                            <td><button onclick={() => buy(key, value.specs, value.quantitys)}>Sell</button></td>

                                        </tr>
                                    ))
                                    : <></>
                                }

                            </tbody>}
                    </table>
                </div>
            </div> */}

        </>
    );
};
export default SellLaptops