import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function MoodDetection() {
    const webcamRef = useRef(null);
    let navigate = useNavigate();
    const [email, setEmail] = useState("");

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
                    setEmail(response.data.email);
                }
                else
                {
                    localStorage.removeItem("user");
                    navigate("/");
                }
            })
        }
        else
        {
            navigate("/");
        }
    }, [navigate]);

    const captureImage = () => 
    {
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(imageSrc); // Check if imageSrc is correctly captured
    
        axios.post("http://localhost:3001/mood-detection", { image: imageSrc }).then((response) =>
        {
            if (response.data.error)
            {
                alert(response.data.error);
            }
            else
            {
                // console.log(response.data.mood);
                getUniqueCode().then((id) =>
                {
                    axios.post("http://localhost:3001/scanMood", 
                    { 
                        idScan: id,
                        email: email,
                        mood: response.data.mood
                    }).then(() =>
                    {
                        navigate(`/recommendation/${id}`);
                    });
                });

                
            }

        }).catch((error) => 
        {
            console.error("Mood detection error:", error);
            console.log("Error details:", error.response ? error.response.data : "No response data");
        });;
    };
    
    async function generateUniqueCode () 
    {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async function getUniqueCode ()  
    {
        let id;
        let isUnique = false;
    
        while (!isUnique) 
        {
            id = await generateUniqueCode();
    
            try {
                const response = await axios.get(`http://localhost:3001/scanMood/byId/${id}`);
                // Jika respons tidak berisi error, maka kodenya unik
                if (response.data.valid) 
                {
                    isUnique = true;
                }
            } catch (error) 
            {
                // Jika terjadi error saat memeriksa ID, anggap kode ini belum ada dan unik
                isUnique = true;
            }
        }
        
        return id;
    }


    return (
        <div className='moodDetectionContainer'>
            <Header />
            <div className='scanBox'>
                <p> Scan Mood mu Sekarang </p>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    height={300}
                    className='webcam'
                />
                <button onClick={captureImage}>Scan Mood</button>
            </div>
        </div>
    );
}

export default MoodDetection;
