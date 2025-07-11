import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/logo.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const Settings = () => {

    const navigate = useNavigate();
    const siteLogoImg = useRef(null);
    const [settingId, setSettingId] = React.useState("");
    const [siteName, setSiteName] = React.useState('');
    const [siteEmail, setSiteEmail] = React.useState('');
    const [sitePhone, setSitePhone] = React.useState('');
    const [siteAddress, setSiteAddress] = React.useState('');
    const [siteDesc, setSiteDesc] = React.useState('');

    const [siteCopyright, setSiteCopyright] = React.useState('');
    const [siteFacebook, setSiteFacebook] = React.useState('');
    const [siteTwitter, setSiteTwitter] = React.useState('');
    const [siteInstagram, setSiteInstagram] = React.useState('');
    const [siteLinkedin, setSiteLinkedin] = React.useState('');
    const [siteYoutube, setSiteYoutube] = React.useState('');
    const [sitePinterest, setSitePinterest] = React.useState('');
    const [siteLogo, setSiteLogo] = React.useState("");
    const [allSettings, setAllSettings] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchSettingsHandler = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/setting/fetch`, {
                withCredentials : true
            });
            setAllSettings(response?.data?.data);
            setSettingId(response?.data?.data?._id);
            setSiteName(response?.data?.data?.site_name);
            setSiteEmail(response?.data?.data?.site_email);
            setSitePhone(response?.data?.data?.site_phone);
            setSiteAddress(response?.data?.data?.site_address);
            setSiteDesc(response?.data?.data?.site_description);
            setSiteCopyright(response?.data?.data?.site_copyright);
            setSiteFacebook(response?.data?.data?.site_facebook);
            setSiteTwitter(response?.data?.data?.site_twitter);
            setSiteInstagram(response?.data?.data?.site_instagram);
            setSiteLinkedin(response?.data?.data?.site_linkedin);
            setSiteYoutube(response?.data?.data?.site_youtube);
            setSitePinterest(response?.data?.data?.site_pinterest);
            setSiteLogo(response?.data?.data?.site_logo_img_path || "");
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

    useEffect(() => {
        fetchSettingsHandler();
    },[]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if(siteName === "" || siteEmail === "" || sitePhone === "" || siteAddress === "" || siteDesc === "" || siteCopyright === "")
        {
            toast.error("Please fill out the required fields");
            return;
        }

        if (siteLogoImg.current.files.length > 0)
        {
            const fileType = siteLogoImg.current.files[0].type;
            if(!["image/jpeg", "image/png", "image/jpg"].includes(fileType))
            {
                toast.error("Please upload a valid logo type");
                return;
            }
        }
        

        setBtnLoading(true);
        try
        {
            const formData = new FormData();
            formData.append('id', settingId);
            formData.append('site_name', siteName);
            formData.append('site_email', siteEmail.toLowerCase());
            formData.append('site_phone', sitePhone);
            formData.append('site_address', siteAddress);
            formData.append('site_description', siteDesc);
            formData.append('site_copyright', siteCopyright);
            formData.append('site_facebook', siteFacebook);
            formData.append('site_twitter', siteTwitter);
            formData.append('site_instagram', siteInstagram);
            formData.append('site_linkedin', siteLinkedin);
            formData.append('site_youtube', siteYoutube);
            formData.append('site_pinterest', sitePinterest);
            formData.append('site_logo', siteLogoImg.current.files[0]);

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/setting/update`, formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials : true
            });
            toast.success(response?.data?.message);
            fetchSettingsHandler();
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || "Internal server error");
        }
        finally
        {
            setBtnLoading(false);
        }
    }


    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Settings</h4>

                        {
                        Object.keys(allSettings).length > 0
                        ?
                        (
                        <>
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteName" className='label'>Site Name <span className='text-danger'>*</span></label>
                                <input type="text" id='siteName' className='inputField' onChange={e => setSiteName(e.target.value)} value={siteName} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteEmail" className='label'>Site Email <span className='text-danger'>*</span></label>
                                <input type="text" id='siteEmail' className='inputField' onChange={e => setSiteEmail(e.target.value)} value={siteEmail} />
                            </div>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="sitePhone" className='label'>Site Phone <span className='text-danger'>*</span></label>
                            <input type="text" id='sitePhone' className='inputField' onChange={e => setSitePhone(e.target.value)} value={sitePhone} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="siteAddress" className='label'>Site Address <span className='text-danger'>*</span></label>
                            <input type="text" id='siteAddress' className='inputField' onChange={e => setSiteAddress(e.target.value)} value={siteAddress} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="siteDesc" className='label'>Site Description <span className='text-danger'>*</span></label>
                            <textarea className='inputField' id="siteDesc" rows={6} onChange={e => setSiteDesc(e.target.value)} value={siteDesc}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="siteCopyright" className='label'>Site Copyright <span className='text-danger'>*</span></label>
                            <textarea className='inputField' id="siteCopyright" rows={2} onChange={e => setSiteCopyright(e.target.value)} value={siteCopyright}></textarea>
                        </div>


                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteFacebook" className='label'>Site Facebook</label>
                                <input type="text" id='siteFacebook' className='inputField' onChange={e => setSiteFacebook(e.target.value)} value={siteFacebook} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteInsta" className='label'>Site Instagram</label>
                                <input type="text" id='siteInsta' className='inputField' onChange={e => setSiteInstagram(e.target.value)} value={siteInstagram} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteLinkedIn" className='label'>Site Linkedin</label>
                                <input type="text" id='siteLinkedIn' className='inputField' onChange={e => setSiteLinkedin(e.target.value)} value={siteLinkedin} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteTwitter" className='label'>Site Twitter</label>
                                <input type="text" id='siteTwitter' className='inputField' onChange={e => setSiteTwitter(e.target.value)} value={siteTwitter} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="sitePinterest" className='label'>Site Pinterest</label>
                                <input type="text" id='sitePinterest' className='inputField' onChange={e => setSitePinterest(e.target.value)} value={sitePinterest} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="siteYoutube" className='label'>Site Youtube</label>
                                <input type="text" id='siteYoutube' className='inputField' onChange={e => setSiteYoutube(e.target.value)} value={siteYoutube} />
                            </div>
                        </div>

                        <div className="mb-3"> 
                            <label htmlFor="img1" className='label'>Site Logo <mark  style={{fontSize:'14px'}}>{`(150px * 50px) less than 5mb`}</mark></label>
                            <img src={siteLogo} alt="Image" className='inputFieldImg' style={{height:'50px', width:'150px', objectFit : 'contain'}} />
                            <input type="file" name='img1' id='img1' className='inputField' ref={siteLogoImg} />
                        </div>

                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Setting Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update Settings"}</button>
                        </div>
                        </>
                        )
                        :
                        (
                        <div className="mb-3">
                            <h3>No Settings Found</h3>
                        </div>
                        )
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;
