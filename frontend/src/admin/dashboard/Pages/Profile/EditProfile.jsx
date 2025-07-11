import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userExampleImg from '../../../../assets/user.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

// if(siteName === "" || siteEmail === "" || sitePhone === "" || siteAddress === "" || siteDesc === "" || siteCopyright === "")
        // {
        //     toast.error("Please fill out the required fields");
        //     return;
        // }

        // if (siteLogoImg.current.files.length > 0)
        // {
        //     const fileType = siteLogoImg.current.files[0].type;
        //     if(!["image/jpeg", "image/png", "image/jpg"].includes(fileType))
        //     {
        //         toast.error("Please upload a valid logo type");
        //         return;
        //     }
        // }

const EditProfile = () => {

    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [userImg, setUserImg] = useState("");
    const imgRef = useRef(null);    
    const [btnLoading, setBtnLoading] = React.useState(false);


    const goBack = () => {
        navigate(-1);
    };

    const fetchProfileHandler = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/getuser`, {
                withCredentials : true
            });
            setProfile(response?.data?.user);
            setId(response?.data?.user?._id);
            setUsername(response?.data?.user?.username);
            setEmail(response?.data?.user?.email);
            setBio(response?.data?.user?.bio);
            setUserImg(response?.data?.user?.userImgPath || "");
        }
        catch(error)
        {
            console.log(error?.response?.data?.message || "Internal server error");
        }
        finally
        {
            setLoading(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const uploadedImg = imgRef?.current?.files?.[0] || "";

        if(username.trim() == "" || bio.trim() == "")
        {
            toast.error("Please fill out the required fields");
            return;
        }

        if(uploadedImg && uploadedImg?.type)
        {
            if(!["image/png", "image/jpg", "image/jpeg"].includes(uploadedImg.type))
            {
                toast.error("Invalid file type.");
                return;
            }
        }

        if(uploadedImg && uploadedImg.size > 5000000)
        {
            toast.error("Image will be less than 5mb");
            return;
        }
        
        

        setBtnLoading(true);
        try
        {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('username', username);
            formData.append('bio', bio);
            formData.append('userImg', uploadedImg);

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/edituserprofile`, formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials : true
            });
            toast.success(response?.data?.message || "Profile updated successfully");

            if(imgRef.current)
            {
                imgRef.current.value = "";
            }
            fetchProfileHandler();
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message);
        }
        finally
        {
            setBtnLoading(false);
        }
    }

    useEffect(() => {
        fetchProfileHandler();
    },[]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="conatiner">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button>Edit Profile</h4>
                        {
                            Object.keys(profile).length > 0
                            ?
                            (
                            <>
                            <div className="mb-3">
                                <label htmlFor="title" className='label'>Username <span className='text-danger'>*</span></label>
                                <input type="text" id='title' className='inputField' onChange={e => setUsername(e.target.value)} value={username} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className='label'>Email</label>
                                <input type="email" disabled id='title' className='inputField' style={{backgroundColor:'#ededee'}} onChange={e => setEmail(e.target.value)} value={email} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bio" className='label'>Bio</label>
                                <textarea onChange={e => setBio(e.target.value)} value={bio} className='inputField' id="bio" rows={6} required></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="img1" className='label'>Profile Photo <mark  style={{fontSize:'14px'}}>{`Less than 5mb`}</mark></label>
                                {
                                    // if user user img exist
                                    userImg
                                    ?
                                    (
                                        <img src={userImg} alt="Image" className='inputFieldImg' style={{height:'150px', width:'200px', objectFit : 'contain'}} />
                                    )
                                    :
                                    (
                                        <img src={userExampleImg} alt="Image" className='inputFieldImg' style={{height:'150px', width:'200px', objectFit : 'contain'}} />
                                    )
                                }
                                <input type="file" name='img1' id='img1' className='inputField' ref={imgRef}/>
                            </div>
                            <div className="mb-3">
                                <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Profile Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update Profile"}</button>
                            </div>
                            </>
                            )
                            :
                            (
                                <div className="text-center">
                                    <h4 className='h4_h'>Profile not found</h4>
                                </div>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
