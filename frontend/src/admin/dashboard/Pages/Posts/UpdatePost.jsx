import React, { useRef, useState, useEffect } from 'react';
import exampleImg from '../../../../assets/user.png';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';
const UpdatePost = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const [img1, setImg1] = useState("");
    const [img2, setImg2] = useState("");
    const img1Ref = useRef(null);
    const img2Ref = useRef(null); 
    const [postCategories, setPostCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchSinglePost = async (pId) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/fetchsinglepost/${pId}`, {
                withCredentials : true
            });
            setPost(response.data.post);
            setPostTitle(response.data.post.post_title);
            setPostDescription(response.data.post.post_description);
            setPostCategory(response.data.post.post_category);
            setImg1(response.data.post.post_img_paths[0]);
            setImg2(response.data.post.post_img_paths[1]);
            setPostCategories(response.data.categories);
        }
        catch(error)
        {
            console.log(error?.response?.data?.message || error.message );
        }
        finally
        {
            setLoading(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!postTitle.trim() || !postDescription.trim() || !postCategory.trim())
        {
            toast.error("Please fill out the required fields");
            return;
        }

        const formData = new FormData();
        formData.append('id', post._id);
        formData.append('post_title', postTitle);
        formData.append('post_description', postDescription);
        formData.append('post_category', postCategory);
        formData.append('img1', img1Ref.current.files[0] || "");
        formData.append('img2', img2Ref.current.files[0] || "");


        setBtnLoading(true);
        try
        {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/post/update`, formData , {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials : true
            });
            toast.success(response.data.message || "Post updated successfullyy");
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message );
        }
        finally
        {
            setBtnLoading(false);
        }
    }


    useEffect(() => {
        if(id.toString().trim === "")
        {
            toast.error("Post not found");
            return;
        }
        fetchSinglePost(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

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
                            <select id='pro_category' className='inputField selectBox' onChange={e => setPostCategory(e.target.value)} value={postCategory} required>
                                <option value="" disabled>--Select Category--</option>
                                {
                                    postCategories.length > 0
                                    ?
                                    (
                                        postCategories.map((p_category, index) => {
                                            return <option selected={p_category._id.toString() === postCategory.toString() ? true : false} key={index} value={p_category._id}>{p_category.c_name}</option>
                                        })
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
                            {
                                img1
                                ?
                                (
                                    <img src={img1} alt="Image" className='inputFieldImg' />
                                )
                                :
                                (
                                    <img src={exampleImg} alt="Image" className='inputFieldImg' />
                                )
                            }
                            <input type="file" name='img1' id='img1' className='inputField' ref={img1Ref} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img2" className='label'>Image 2</label>
                            {
                                img1
                                ?
                                (
                                    <img src={img2} alt="Image" className='inputFieldImg' />
                                )
                                :
                                (
                                    <img src={exampleImg} alt="Image" className='inputFieldImg' />
                                )
                            }
                            <input type="file" name='img2' id='img2' className='inputField' ref={img2Ref} />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Post Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update & Publish Post"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatePost;
