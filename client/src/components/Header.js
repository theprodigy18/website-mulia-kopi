import React, { useState } from 'react';
import Logo from "../assets/images/logo_mulia_kopi.png";
import Cart from "../assets/images/shopping-cart.svg";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() 
{
    const location = useLocation();
    let navigate = useNavigate();
    const [login, setLogin] = useState(false);
    const [namaPelanggan, setNamaPelanggan] = useState("");
    const publicUrl = process.env.PUBLIC_URL + '/images/';
    const [cartOpen, setCartOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => 
    {
        const token = localStorage.getItem('user');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get("http://localhost:3001/auth/verify-token", 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then((response) => 
            {
                if (response.data.valid) 
                {
                    setLogin(true);
                    setNamaPelanggan(response.data.namaPelanggan);
                }
                else
                {
                    localStorage.removeItem("user");
                    setLogin(false);
                    setNamaPelanggan("");
                }
            })

        }
        else
        {
            setLogin(false);
            setNamaPelanggan("");
        }

        if (window.innerWidth > 430) {
            const handleScroll = () => 
            {
                const header = document.querySelector(".header");

                if (window.scrollY > 0) 
                {
                    header.classList.add("scroll");
                } else 
                {
                    header.classList.remove("scroll");
                }
            };

            // Tambahkan event listener scroll
            window.addEventListener("scroll", handleScroll);

            // Bersihkan event listener saat komponen di-unmount
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
        else
        {
            return;
        }
        
    }, [navigate]);

    const goHome = () =>
    {
        navigate("/");
    };

    const handleCartOpen = () =>
    {
        if (cartOpen)
            return setCartOpen(false);

        return setCartOpen(true);
    }
    const handleProfileOpen = () =>
    {
        if (profileOpen)
            return setProfileOpen(false);

        return setProfileOpen(true);
    }
    const handleLogout = () =>
    {
        localStorage.removeItem("user");
        window.location.reload();
    }

    return (
        <div className='header'>
            <div className='logo' onClick={() => goHome()}>
                <img src={Logo} alt='logo' />
            </div>
            <div className='rightSide'>
                <ul className='navLink'>
                    <li>
                        <a href='/'> home </a>
                    </li>
                    <li>
                        <a href='/#aboutUs'> about us </a>
                    </li>
                    <li>
                        <a href='/menu/all'> menu </a>
                    </li>
                    <li>
                        <a href={`${location.pathname}#footer`} > contact </a>
                    </li>

                </ul>
                {login && (
                    <div className='cart'>
                        <img src={Cart} alt='cart' onClick={handleCartOpen} />
                        <span>|</span>
                        <p onClick={handleProfileOpen}> <i className="fa-solid fa-user"></i> {namaPelanggan} </p>
                        {profileOpen && (
                            <div className='logout'>
                                <button onClick={handleLogout}> Logout </button>
                            </div>
                        )}
                    </div>
                )}
                {!login && (
                    <div className='cart'>
                        <button onClick={() => navigate("/login")}> Login </button>
                    </div>
                )}
            </div>
            {cartOpen && (
                <div className='cartOpen'>
                    <img src={publicUrl + "Group 195.jpg"} alt='gambar' className='imgKeranjang' />
                    <img src={publicUrl + "Group 194.png"} alt='back' className='imgBack' onClick={handleCartOpen}/>
                    <div className='cartMenuWrapper'>
                        <div className='cartMenu'>
                            <div className='cartMenuBox'>
                                <img src={publicUrl + "menu/tahu-bakso.jpg"} alt='menu' />
                                <div className='cartMenuDetail'>
                                    <h1> Tahu Bakso </h1>
                                    <p> Rp 8.000,00 </p>
                                </div>
                                <p> <i className="fa-solid fa-minus"></i> 10 <i className="fa-solid fa-plus"></i> </p>
                            </div>
                            <div className='cartMenuBox'>
                                <img src={publicUrl + "menu/ice-coklat.jpg"} alt='menu' />
                                <div className='cartMenuDetail'>
                                    <h1> Es Coklat </h1>
                                    <p> Rp 13.000,00 </p>
                                </div>
                                <p> <i className="fa-solid fa-minus"></i> 1 <i className="fa-solid fa-plus"></i> </p>
                            </div>
                        </div>
                        <div className='cartMenuTotal'>
                            <div className='totalBox'>
                                <h1> Total </h1>
                                <p> Rp 93.000,00 </p>
                            </div>
                            <button> Check Out </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default Header
