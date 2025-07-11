import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExampleImg from '../../../../assets/user1.png';
import Loader from '../../../../components/Loaders/Loader';

const SinglePost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState({});
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
        if(id.toString().trim === "")
        {
            toast.error("Message not found");
            return;
        }
        fetchSinglePost(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row dashBox dashsingleproduct my-1">
                {
                    post && Object.keys(post).length > 0
                    ?
                    (
                        <>
                        <div className="col-6">
                        <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Post Details</h4>
                            <h2 className='h5_h'>Post Title</h2>
                            <p>{post.post_title}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Post Description</h2>
                            <p>{post.post_description}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Post Category</h2>
                            <p>{post.post_category.c_name}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Post Images</h2>
                            <img src={post.post_img_paths[0] ? post.post_img_paths[0] : ExampleImg } alt="image" />
                            <img src={post.post_img_paths[1] ? post.post_img_paths[1] : ExampleImg} alt="image" />
                            <hr></hr>
                            <h2 className='h5_h'>Time</h2>
                            <p>
                                {new Date(post.timestamp).toLocaleString()}
                                
                            </p>
                        </div>
                        </>
                    )
                    :
                    (
                        <div className="col-6">
                        <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Message Details</h4>
                        <span>Message does not found!</span>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default SinglePost;
