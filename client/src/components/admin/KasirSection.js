import React, { useEffect, useState } from 'react';
import axios from "axios";

function KasirSection() 
{
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    const [listOfMenu, setListOfMenu] = useState([]);
    const [menuName, setMenuName] = useState("");

    useEffect(() =>
    {
        axios.get("http://localhost:3001/daftarMenu").then((response) =>
        {
            setListOfMenu(response.data);
        });
    }, []);

    const handleSearch = (() =>
    {
        if (menuName === "")
        {
            axios.get("http://localhost:3001/daftarMenu").then((response) =>
            {
                setListOfMenu(response.data);
            });
        }
        else
        {
            axios.get(`http://localhost:3001/daftarMenu/byName/${menuName}`).then((response) =>
            {
                setListOfMenu(response.data);
            });
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
    
    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    const listByCategory = (category) =>
    {
        setMenuName("");

        axios.get(`http://localhost:3001/daftarMenu/${category}`).then((response) =>
        {
            setListOfMenu(response.data);
        });
    };

    return (
        <div className='kasirContainer'>
            <div className='categoryMenuKasir'>
                <button onClick={() => listByCategory("kopi")}> Kopi </button>
                <button onClick={() => listByCategory("non-kopi")}> Non Kopi </button>
                <button onClick={() => listByCategory("makanan")}> Makanan </button>
            </div>
            <div className='menuContainerkasir'>
                {listOfMenu.map((menu, key) =>
                {
                    return (
                        <div className='menuBoxKasir' key={key}>
                            <img src={publicUrl + menu.gambar} alt='menu' />
                            <p className='menuName'> {menu.namaMenu} </p>
                            <p className='menuPrice'> {formatRupiah(menu.harga)} </p>
                        </div>
                    )
                })}
            </div>

            <div className='kasirBar'>
                <div className='left'>
                    <p> Total Harga </p>
                    <h1>Rp. 39.000,00 </h1>
                </div>
                <div className='right'>
                    <div className='amount'>
                        <p className='increment'><i className="fa-solid fa-minus"></i></p>
                        <p className='number'> 1 </p>
                        <p className='increment'><i className="fa-solid fa-plus"></i></p>
                    </div>
                    <button> Check Out </button>
                </div>
            </div>

            <div className='searchBar'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    name='menu'
                    value={menuName}
                    onChange=
                    {
                        (event) => {setMenuName(event.target.value)}
                    } 
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className='rightSidebar'>
                <p> Total Pesanan </p>
                <div className='pesananContainer'>
                    <div className='pesananBox'>
                        <img src={publicUrl + "pisang-coklat.jpg"} alt='menu' />
                        <div className='infoPesanan'>
                            <h1> PISANG COKLAT </h1>
                            <p> Rp. 13.000,00 </p>
                        </div>
                        <p> 1x </p>
                    </div>
                    <div className='pesananBox'>
                        <img src={publicUrl + "ice-choco-oreo.jpg"} alt='menu' />
                        <div className='infoPesanan'>
                            <h1> ES CHOCO OREO </h1>
                            <p> Rp. 13.000,00 </p>
                        </div>
                        <p> 2x </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KasirSection
