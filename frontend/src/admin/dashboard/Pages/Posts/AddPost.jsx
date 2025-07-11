import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const AddPost = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const img1 = img1Ref?.current?.files?.[0];
        const img2 = img2Ref?.current?.files?.[0];

        if(postTitle == "" || postDescription == "")
        {
            toast.error("Please fill all the fields");
            return;
        }

        // if img exist then check its size
        if(img1 && img1.size > 5000000)
        {
            toast.error("Image 1 size should be less than 5MB");
            return;
        }
        if(img2 && img2.size > 5000000)
        {
            toast.error("Image 2 size should be less than 5MB");
            return;
        }
        // check img types
        if(img1 && !["image/jpeg", "image/png", "image/jpg"].includes(img1.type))
        {
            toast.error("Image 1 type should be jpeg, jpg or png");
            return;
        }
        if(img2 && !["image/jpeg", "image/png", "image/jpg"].includes(img2.type))
        {
            toast.error("Image 2 type should be jpeg, jpg or png");
            return;
        }


        setBtnLoading(true);
        const formData = new FormData();
        formData.append("post_title", postTitle);
        formData.append("post_description", postDescription);
        formData.append("post_category", postCategory);
        formData.append("img1", img1);
        formData.append("img2", img2);
        
        try
        {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/post/add`, formData , {
                withCredentials : true
            });
            toast.success(response?.data?.message || "Post saved & published successfully");
            setPostTitle("");
            setPostDescription("");
            setPostCategory("");
            img1Ref.current.value = "";
            img2Ref.current.value = "";
            setLoading(false);
            navigate("/admin/posts");
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

    const fetchPostCategories = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/postcategory/fetchall`, {
                withCredentials : true
            });
            setCategories(response?.data?.categories);
        }
        catch(error)
        {
            console.log(error?.response?.data?.message || error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPostCategories();
    }, []);

    return (
        <div className="conatiner">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Add Post</h4>
                        <div className="mb-3">
                            <label htmlFor="title" className='label'>Post Title</label>
                            <input type="text" id='title' className='inputField' onChange={e => setPostTitle(e.target.value)} value={postTitle} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className='label'>Post Description</label>
                            <textarea className='inputField' id="description" onChange={e => setPostDescription(e.target.value)} value={postDescription} rows={6} required></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pro_category" className='label'>Post Category</label>
                            <select id='pro_category' className='inputField selectBox' onChange={e => setPostCategory(e.target.value)} value={postCategory}>
                                <option value="" disabled>--Select Category--</option>
                                {
                                    categories.length > 0
                                    ?
                                    (
                                        categories.map((category, index) => (
                                            <option key={index} value={category._id}>{category.c_name}</option>
                                        ))
                                    )
                                    :
                                    (
                                        <option value="">No Category Found</option>
                                    )
                                
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img1" className='label'>Image 1</label>
                            <input type="file" name='img1' id='img1' className='inputField' ref={img1Ref} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img2" className='label'>Image 2</label>
                            <input type="file" name='img2' id='img2' className='inputField' ref={img2Ref} />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Post Uploading<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Save & Publish Post"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPost;
