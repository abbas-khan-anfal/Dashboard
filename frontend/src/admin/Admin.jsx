import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashLogin from './auth/DashLogin';
import Dashboard from './dashboard/Dashboard';
import ForgotPass from './auth/ForgotPass';
import OtpVerifi from './auth/OtpVerifi';
import axios from 'axios';
import AuthContext from '../context/AuthProvider/AuthContext';
import Loader from '../components/Loaders/Loader';


const Admin = () => {

    const {dashUserState, setDashUserState, setDashUser} = useContext(AuthContext);
    const [loading, setLoading] = React.useState(true);

    const isUserAuthenticated = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/getuser`, {
                withCredentials: true,
            });
            if(response.data.success)
            {
                setDashUserState(true);
                setDashUser(response?.data?.user);
            }
        }
        catch(error)
        {
            console.log(error.response?.data?.message || error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() => {
        isUserAuthenticated();
    }, [dashUserState]);
    if(loading)
    {
        return (
            <div style={{display:'flex', justifyContent:'center',alignItems:'center', height:'100vh', width:'100%'}}>
                <Loader width="45px" height="45px" />
                <span className='d-inline-block mx-2'>Loading...</span>
            </div>
        )
    }

    return (
        dashUserState
        ?
        (
                <Dashboard />
        )
        :
        (
                <Routes>
                    <Route path='/dashboard' element={<Navigate to="/admin/login" />} />
                    <Route path='/' element={<Navigate to="/admin/login" />} />
                    <Route path='/login' element={<DashLogin />} />
                    <Route path='/forgotpassword' element={<ForgotPass />} />
                    <Route path='/otpverification' element={<OtpVerifi />} />
                    <Route path='*' element={<div>Page not foundkk</div>} />
                </Routes>
        )
    );
}

export default Admin;
