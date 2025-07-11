import React, { useRef, useState, useEffect } from 'react';
import exampleImg from '../../../../assets/user.png';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const UpdateProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [productTitle, setProductTitle] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productQty, setProductQty] = useState("");
    const [productOriginalPrice, setProductOriginalPrice] = useState("");
    const [productSellingPrice, setProductSellingPrice] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productId, setProductId] = useState("");
    const [img1, setImg1] = useState("");
    const [img2, setImg2] = useState("");
    const [img3, setImg3] = useState("");
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);
    const img3Ref = useRef(null); 
    const [productCategories, setProductCategories] = useState([]);
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
            setProductId(response.data.product._id);
            setProductTitle(response.data.product.pro_title);
            setProductDesc(response.data.product.pro_description);
            setProductCategory(response.data.product?.pro_category?._id);
            setProductQty(response.data.product.pro_qty);
            setProductOriginalPrice(response.data.product.original_price);
            setProductSellingPrice(response.data.product.selling_price);
            setProductBrand(response.data.product.pro_brand);
            setImg1(response.data.product.pro_img_paths[0]);
            setImg2(response.data.product.pro_img_paths[1]);
            setImg3(response.data.product.pro_img_paths[2]);
            setProductCategories(response.data.categories);
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
        if(productTitle.trim() == "" || productDesc.trim() == "" || productCategory.trim() == "" || productBrand.trim() == "")
        {
            toast.error("Please fill out the required fields");
            return;
        }
        // also check product qty and prices if they are numbers
        if(isNaN(productQty) || isNaN(productOriginalPrice) || isNaN(productSellingPrice))
        {
            toast.error("Please enter valid numbers for quantity and prices");
            return;
        }

        // also check product qty and prices if they are not empty
        if(productQty.toString().trim() == "" || productOriginalPrice.toString().trim() == "" || productSellingPrice.toString().trim() == "")
        {
            toast.error("Please enter valid numbers for quantity and prices");
            return;
        }

        const formData = new FormData();
        formData.append("pro_title", productTitle);
        formData.append("pro_description", productDesc);
        formData.append("pro_category", productCategory);
        formData.append("pro_qty", productQty);
        formData.append("original_price", productOriginalPrice);
        formData.append("selling_price", productSellingPrice);
        formData.append("pro_brand", productBrand);
        formData.append("p_id", productId);
        if(img1Ref.current.files[0])
        {
            formData.append("img1", img1Ref?.current?.files?.[0]);
        }
        if(img2Ref.current.files[0])
        {
            formData.append("img2", img2Ref?.current?.files?.[0]);
        }
        if(img3Ref.current.files[0])
        {
            formData.append("img3", img3Ref?.current?.files?.[0]);
        }

        // also if img1Ref has img so check its size to 5md
        if(img1Ref.current.files[0] && img1Ref.current.files[0].size > 5000000)
        {
            toast.error("Image 1 size should be less than 5MB");
            return;
        }
        if(img2Ref.current.files[0] && img2Ref.current.files[0].size > 5000000)
        {
            toast.error("Image 2 size should be less than 5MB");
            return;
        }
        if(img3Ref.current.files[0] && img3Ref.current.files[0].size > 5000000)
        {
            toast.error("Image 3 size should be less than 5MB");
            return;
        }

        // check imgs type
        if(img1Ref.current.files[0] && !img1Ref.current.files[0].type.includes("image"))
        {
            toast.error("Image 1 should be an image");
            return;
        }
        if(img2Ref.current.files[0] && !img2Ref.current.files[0].type.includes("image"))
        {
            toast.error("Image 2 should be an image");
            return;
        }
        if(img3Ref.current.files[0] && !img3Ref.current.files[0].type.includes("image"))
        {
            toast.error("Image 3 should be an image");
            return;
        }


        setBtnLoading(true);
        try
        {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/product/update`, formData , {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials : true
            });
            toast.success(response.data.message || "Product updated successfully");
            fetchSingleProduct(id);
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
            toast.error("Product not found");
            return;
        }
        fetchSingleProduct(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="conatiner">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Add Product</h4>
                        <div className="mb-3">
                            <label htmlFor="title" className='label'>Product Title</label>
                            <input type="text" id='title' className='inputField' onChange={e => setProductTitle(e.target.value)} value={productTitle} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className='label'>Product Description</label>
                            <textarea className='inputField' id="description" onChange={e => setProductDesc(e.target.value)} value={productDesc} rows={6} required></textarea>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="pro_orig_price" className='label'>Product Original Price</label>
                                <input type="text" id='pro_orig_price' className='inputField' onChange={e => setProductOriginalPrice(e.target.value)} value={productOriginalPrice} required />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="pro_sell_price" className='label'>Product Selling Price</label>
                                <input type="text" id='pro_sell_price' className='inputField' onChange={e => setProductSellingPrice(e.target.value)} value={productSellingPrice} required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="pro_qty" className='label'>Product Qty</label>
                                <input type="text" id='pro_qty' className='inputField' onChange={e => setProductQty(e.target.value)} value={productQty} required />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="pro_brand" className='label'>Product Brand</label>
                                <input type="text" id='pro_brand' className='inputField' onChange={e => setProductBrand(e.target.value)} value={productBrand} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pro_category" className='label'>Product Category</label>
                            <select id='pro_category' className='inputField selectBox' onChange={e => setProductCategory(e.target.value)} value={productCategory} required>
                                <option value="" disabled>--Select Category--</option>
                                {
                                    productCategories.length > 0
                                    ?
                                    (
                                        productCategories.map((p_category, index) => {
                                            return <option  key={index} value={p_category._id}>{p_category.c_name}</option>
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
                            <label htmlFor="img3" className='label'>Image 3</label>
                            {
                                img3
                                ?
                                (
                                    <img src={img3} alt="Image" className='inputFieldImg' />
                                )
                                :
                                (
                                    <img src={exampleImg} alt="Image" className='inputFieldImg' />
                                )
                            }
                            <input type="file" name='img3' id='img3' className='inputField' ref={img3Ref} />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Product Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update & Publish Product"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
