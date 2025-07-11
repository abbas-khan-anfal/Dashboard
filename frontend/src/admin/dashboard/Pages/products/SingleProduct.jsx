import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExampleImg from '../../../../assets/user1.png';
import Loader from '../../../../components/Loaders/Loader';

const SingleProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchSingleProduct = async (pId) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product/fetchsingleproduct/${pId}`, {
                withCredentials : true
            });
            setProduct(response.data.product);
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
        if(id.toString().trim === "")
        {
            toast.error("Product not found");
            return;
        }
        fetchSingleProduct(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>
    
    return (
        <div className="container">
            <div className="row dashBox dashsingleproduct my-1">
                {
                    product && Object.keys(product).length > 0
                    ?
                    (
                        <>
                        <div className="col-6">
                        <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Product Details</h4>
                            <h2 className='h5_h'>Product Title</h2>
                            <p>{product.pro_title}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Product Description</h2>
                            <p>{product.pro_description}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Product Category</h2>
                            <p>{product?.pro_category?.c_name || "No cateory found"}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Product Images</h2>
                            <img src={product.pro_img_paths[0] ? product.pro_img_paths[0] : ExampleImg } alt="image" />
                            <img src={product.pro_img_paths[1] ? product.pro_img_paths[1] : ExampleImg} alt="image" />
                            <img src={product.pro_img_paths[2] ? product.pro_img_paths[2] : ExampleImg} alt="image" />
                            <hr></hr>
                            <h2 className='h5_h'>Time</h2>
                            <p>
                                {new Date(product.timestamp).toLocaleString()}
                                
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

export default SingleProduct;
