import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginAccess from '../components/auth/LoginAccess';

function Login() 
{
    let navigate = useNavigate();
    const [errMessage, setErrMessage] = useState("");

    const initialValues = 
    {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object().shape(
    {
        email: Yup.string().email('*Invalid email format').required('*Required'),
        password: Yup.string().min(8, '*Must be at least 8 characters').max(20, '*Must be 20 characters or less').required('*Required')
    });

    const onSubmit = (data) =>
    {
        axios.post("http://localhost:3001/auth/login", data).then((response) =>
        {
            if (response.data.error)
            {
                setErrMessage(response.data.error);
            }
            else
            {
                localStorage.setItem("user", response.data.token);
                navigate("/welcome");
            }
        });
    };

    return (
        <div className='authContainer'>
            <Formik 
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='authBox'>
                    {errMessage && (
                        <div className='errors'>
                            <p>{errMessage}</p>
                            <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                        </div>
                    )}
                    <h1> Login </h1>
                    <ErrorMessage name='email' component="span" className='errMessage' />
                    <Field 
                        className="authField" 
                        name="email" 
                        placeholder="email" 
                    /> 
                    <ErrorMessage name='password' component="span" className='errMessage' />
                    <Field 
                        className="authField" 
                        name="password" 
                        placeholder="password" 
                        type="password"
                    /> 

                    <div className='linksBox'>
                        <a href='/'> Lupa password? </a>
                        <a href='/register'> Belum punya akun? Daftar </a>
                    </div>

                    <button type='submit' className='authButton'> Login </button>
                    <a href='/'> Lanjut tanpa login </a>
                </Form>
            </Formik>
            <LoginAccess />
        </div>
    )
}

export default Login
