import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MenuDescription() 
{
    const Gambar = process.env.PUBLIC_URL + '/images/menu/';
    let idMenu = useParams().idMenu;
    const [menu, setMenu] = useState({});
    const [email, setEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");


    useEffect(() =>
    {
        axios.get(`http://localhost:3001/daftarMenu/byId/${idMenu}`).then((response) =>
        {
            setMenu(response.data);
        });

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
                    setEmail(response.data.email);
                }
                else
                {
                    setEmail("");
                }
            })
        }
        else
        {
            setEmail("");
        }

    }, [idMenu]);

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    const handleBeliSekarang = () =>
    {
        if (!email)
            return setErrMessage("Login terlebih dahulu untuk membeli lewat sistem");
        
        axios.post("http://localhost:3001/keranjang", { email: email, idMenu: idMenu, jumlah: 1 }).then((response) =>
        {
            console.log(response.data);
        });
    };

    

    return (
        <div className='menuDescriptionContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <h1> {menu.namaMenu} </h1>
            <img src={Gambar + menu.gambar} alt='menu' />
            <div className='descriptionContainer'>
                <p> {menu.detailMenu} </p>
                <p className='menuPrice'> {formatRupiah(menu.harga)} </p>
                <button onClick={handleBeliSekarang}> Tambah ke Keranjang </button>
            </div>
        </div>
    )
}

export default MenuDescription
