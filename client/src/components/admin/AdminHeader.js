import React, { useEffect } from 'react'
import User from "../../assets/images/User.svg";
import Logo from "../../assets/images/logo_mulia_kopi.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminHeader() 
{
    let navigate = useNavigate();

    useEffect(() =>
    {
        const token = localStorage.getItem('token');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get("http://localhost:3001/admin/verify-token", 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then((response) => 
            {
                // Jika token valid, arahkan ke dashboard
                if (!response.data.valid) 
                {
                    navigate('/admin/login'); // Arahkan ke dashboard
                }
            })
        }
        else
        {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <div className='adminHeader'>
            <div className='adminProfile'>
                <img src={User} alt='admin' />
                <p> Atmin </p>
            </div>
            <img src={Logo} alt='logo '/>
        </div>
    )
}

export default AdminHeader
