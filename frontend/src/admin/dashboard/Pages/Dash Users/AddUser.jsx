import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import toast from 'react-hot-toast';
import AuthContext from '../../../../context/AuthProvider/AuthContext';
import Loader from '../../../../components/Loaders/Loader';

const AddUser = () => {

    const { dashUser } = useContext(AuthContext);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [btnLoading, setBtnLoading] = React.useState(false);
    const navigate = useNavigate();
    
    // go back function
    const goBack = () => {
        navigate(-1);
    };

    // function for add user
    const submitHandler = async (e) => {
        e.preventDefault();

        if(dashUser.role !== "admin")
        {
            toast.error("You are not authorized to perform this action");
            return;
        }

        if(email.trim() == "" || password.trim() == "" || role.trim() == "")
        {
            toast.error("Please fill out the required fields");
            return;
        }
        if(!validator.isEmail(email))
        {
            toast.error("Please enter a valid email");
            return;
        }
        if(password.length < 8)
        {
            toast.error("Password must be at least 8 characters");
            return;
        }


        setBtnLoading(true);
        const userData = {
            email,
            password,
            username,
            role
        };
        try
        {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/signup`, userData, {
                headers: {  
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(response.data.success)
            {
                toast.success(response?.data?.message || "User created successfully");
                setEmail("");
                setPassword("");
                setUsername("");
                setRole("");
            }
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message);
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
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Add New User</h4>
                        <div className="mb-3">
                            <label htmlFor="userUsername" className='label'>Username</label>
                            <input type="text" id='userUsername' className='inputField' onChange={e => setUsername(e.target.value)} value={username} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userEmail" className='label'>Email</label>
                            <input type="email" id='userEmail' className='inputField' onChange={e => setEmail(e.target.value)} value={email} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userPassword" className='label'>Password</label>
                            <input type="password" id='userPassword' className='inputField' onChange={e => setPassword(e.target.value)} value={password} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userRole" className='label'>User Role</label>
                            <select id="userRole" className='inputField' required onChange={(e) => setRole(e.target.value)} value={role}>
                                <option selected>--Select User Role--</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>User Saving<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Add User"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddUser;
