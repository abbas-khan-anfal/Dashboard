import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthProvider/AuthContext';
import Loader from './../../components/Loaders/Loader';

const DashLogin = () => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = React.useState(false);

    const {dashUserState, setDashUserState} = useContext(AuthContext);
    
    // go back function
    const goBack = () => {
        navigate(-1);
    };

    // function for login user
    const submitHandler = async (e) => {
        e.preventDefault();
        if(email.trim() == "" && password.trim() == "")
        {
            toast.error("Email & Password required");
            return;
        }

        if(!validator.isEmail(email))
        {
            if(email.trim() === "")
            {
                toast.error("Email required");
                return;
            }
            toast.error("Invalid email");
            return;
        }
        if(password.trim() === "")
        {
            toast.error("Password required");
            return;
        }


        setBtnLoading(true);
        const userData = {
            email,
            password
        };
        try
        {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/login`, userData, {
                headers: {  
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(response.data.success)
            {
                toast.success(response?.data?.message || "Login successfully");
                setDashUserState(true);
                setEmail("");
                setPassword("");
            }
        }
        catch(error)
        {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal server error");
            return;
        }
        finally
        {
            setBtnLoading(false);
        }
    
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Login</h4>
                        <div className="mb-3">
                            <label htmlFor="email" className='label'>Email</label>
                            <input type="text" id='email' className='inputField' onChange={e => setEmail(e.target.value)} value={email} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className='label'>Password</label>
                            <input type="password" id='password' className='inputField' onChange={e => setPassword(e.target.value)} value={password} required />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading}
                            className='md_btn'>{btnLoading ? <>Logging<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Login"}</button>
                        </div>
                        <div className="mb-3">
                            <NavLink to="/admin/forgotpassword" className='anchorBtn1'>Forgot password</NavLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DashLogin;
