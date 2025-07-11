import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import toast from 'react-hot-toast';
import AuthContext from '../../../../context/AuthProvider/AuthContext';
import exampleImg from '../../../../assets/user.png';
import Loader from '../../../../components/Loaders/Loader';

const UpdateUser = () => {

    const { id } = useParams();
    const { dashUser } = useContext(AuthContext);
    const [username, setUsername] = React.useState('');
    const [role, setRole] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [profileImg, setProfileImg] = React.useState('');
    const [updatedUser, setUpdatedUser] = React.useState({});
    const profileImgRef = useRef(null);
    const [loading, setLoading] = React.useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);
    const navigate = useNavigate();
    
    // go back function
    const goBack = () => {
        navigate(-1);
    };

    // function for add user
    const submitHandler = async (e) => {
        e.preventDefault();

        const profilePhoto = profileImgRef?.current?.files?.[0] || "";

        if(dashUser.role !== "admin")
        {
            toast.error("You are not authorized to perform this action");
            return;
        }

        if(username.trim() == "" || role.trim() == "")
        {
            toast.error("Please fill out the required fields");
            return;
        }

        if (profilePhoto) {
            if (!profilePhoto.type || !['image/jpeg', 'image/png', 'image/jpg'].includes(profilePhoto.type)) {
                toast.error("Profile photo should be in jpeg, jpg, or png format");
                return;
            }
        
            if (!profilePhoto.size || profilePhoto.size > 5000000) {
                toast.error("Profile photo size should be less than 5MB");
                return;
            }
        }
        

        const formData = new FormData();
        formData.append('id', id);
        formData.append('username', username);
        formData.append('bio', bio);
        formData.append('role', role);
        formData.append('userImg', profilePhoto);

        setBtnLoading(true);
        try
        {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/update`, formData, {
                headers: {  
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if(response.data.success)
            {
                toast.success(response?.data?.message || "User updated successfully");
                fetchUser(id);
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


    // function to fetch user
    const fetchUser = async (userId) => {
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/fetchsingleuser/${userId}`,{
                withCredentials: true
            });
            if(response.data.success)
            {
                setUpdatedUser(response?.data?.user);
                setUsername(response?.data.user?.username);
                setRole(response?.data?.user?.role);
                setBio(response?.data?.user?.bio);
                setProfileImg(response?.data?.user?.userImgPath);
            }
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message);
            return;
        }
        finally
        {
            setLoading(false);
        }
    
    }

    useEffect(() => {
        fetchUser(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Update User</h4>
                        <div className="mb-3">
                            <label htmlFor="userUsername" className='label'>Username</label>
                            <input type="text" id='userUsername' className='inputField' onChange={e => setUsername(e.target.value)} value={username} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userBio" className='label'>Bio</label>
                            <textarea id="userBio" className='inputField' rows={4} onChange={(e) => setBio(e.target.value)} value={bio}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userRole" className='label'>User Role</label>
                            <select id="userRole" className='inputField' required onChange={(e) => setRole(e.target.value)} value={role}>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        
                         <div className="mb-3">
                                <label htmlFor="img1" className='label'>Profile Photo <mark>Less than 5mb</mark></label>
                                    {
                                        profileImg
                                        ?
                                        (
                                            <img src={profileImg} alt="Image" className='inputFieldImg' />
                                        )
                                        :
                                        (
                                            <img src={exampleImg} alt="Image" className='inputFieldImg' />
                                        )
                                    }
                                    <input type="file" name='img1' id='img1' className='inputField' ref={profileImgRef} />
                            </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>User Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update User"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;
