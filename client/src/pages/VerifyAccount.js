import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function VerifyAccount() 
{
    let navigate = useNavigate();
    const { email, token } = useParams();
    const [errMessage, SetErrMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [isExecuted, setIsExecuted] = useState(false);

    useEffect(() =>
    {
        if (!isExecuted)
        {
            axios.get(`http://localhost:3001/auth/verify/${email}/${token}`).then((response) => 
            {
                setIsExecuted(true);
                if (response.data.error) 
                {
                    setSuccess("");
                    SetErrMessage(response.data.error);
                }
                else 
                {
                    SetErrMessage("");
                    setSuccess(response.data.message);
                }
            })

            
        }
    }, [isExecuted, email, token]);

    return (
        <div className='authContainer'>
            {success && (
                <div className='authBox'>
                    <h1> {success} </h1>
                    <button className='authButton2' onClick={() => navigate("/login")}> Kembali ke Login </button>
                </div>
            )}
            {errMessage && (
                <div className='authBox'>
                    <p> {errMessage} </p>
                    <button className='authButton2' onClick={() => navigate("/")}> Home </button>
                </div>
            )}
        </div>
    )
}

export default VerifyAccount
