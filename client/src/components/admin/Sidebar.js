import React from 'react'
import { useNavigate } from 'react-router-dom'

function Sidebar() 
{
    let navigate = useNavigate();

    return (
        <div className='sidebar'>
            <div className='adminMenu'>
                <p onClick={() => navigate("/admin/kasir")}> Kasir </p>
                <p onClick={() => navigate("/admin/po")}> Pesanan Online</p>
                <p> Riwayat Transaksi </p>
                <p> Laporan Harian </p>
            </div>
            <p className='adminCopyright'> &copy; 2024 Mulia Kopi, Inc. <br /> All Right Reserved. </p>
        </div>
    )
}

export default Sidebar
