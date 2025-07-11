import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const AddProduct = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [proTitle, setProTitle] = useState("");
    const [proDesc, setProDesc] = useState("");
    const [proCategory, setProCategory] = useState("");
    const [proBrand, setProBrand] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [proQty, setProQty] = useState("");
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);
    const img3Ref = useRef(null);
    const [categories, setCategories] = useState([]);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const img1 = img1Ref?.current?.files?.[0];
        const img2 = img2Ref?.current?.files?.[0];
        const img3 = img3Ref?.current?.files?.[0];

        if(proTitle.trim() == "" || proDesc.trim() == "" || proQty.trim() == "" || proCategory.trim() == "" || proBrand.trim() == "" || originalPrice.trim() == "" || sellingPrice.trim() == "" )
        {
            toast.error("Please fill out the required fields");
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
        if(img3 && img3.size > 5000000)
        {
            toast.error("Image 3 size should be less than 5MB");
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
        if(img3 && !["image/jpeg", "image/png", "image/jpg"].includes(img3.type))
        {
            toast.error("Image 3 type should be jpeg, jpg or png");
            return;
        }


        setBtnLoading(true);
        const formData = new FormData();
        formData.append("pro_title", proTitle);
        formData.append("pro_description", proDesc);
        formData.append("pro_category", proCategory);
        formData.append("pro_brand", proBrand);
        formData.append("original_price", originalPrice);
        formData.append("selling_price", sellingPrice);
        formData.append("pro_qty", proQty);
        formData.append("img1", img1);
        formData.append("img2", img2);
        formData.append("img3", img3);
        
        try
        {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product/add`, formData , {
                withCredentials : true
            });
            toast.success(response?.data?.message || "Product saved & published successfully");
            // setLoading(false);
            setProTitle("");
            setProDesc("");
            setProCategory("");
            setProBrand("");
            setOriginalPrice("");
            setSellingPrice("");
            setProQty("");

            if(img1Ref?.current?.files?.[0])
            {
                img1Ref.current.value = "";
            }
            if(img2Ref?.current?.files?.[0])
            {
                img2Ref.current.value = "";
            }
            if(img3Ref?.current?.files?.[0])
            {
                img3Ref.current.value = "";
            }
            // navigate("/admin/products");
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

    const fetchProductCategories = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/productcategory/fetchall`, {
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
        fetchProductCategories();
    }, []);

    return (
        <div className="conatiner">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Add Product</h4>
                        <div className="mb-3">
                            <label htmlFor="title" className='label'>Product Title</label>
                            <input type="text" id='title' className='inputField' onChange={e => setProTitle(e.target.value)} value={proTitle} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className='label'>Product Description</label>
                            <textarea className='inputField' id="description" onChange={e => setProDesc(e.target.value)} value={proDesc} rows={6} required></textarea>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="p_brand" className='label'>Product Brand</label>
                                <input type="text" id='p_brand' className='inputField' required onChange={e => setProBrand(e.target.value)} value={proBrand} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="p_qty" className='label'>Product Qty</label>
                                <input type="text" id='p_qty' className='inputField' required onChange={e => setProQty(e.target.value)} value={proQty} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pro_category" className='label'>Product Category</label>
                            <select id='pro_category' className='inputField selectBox' onChange={e => setProCategory(e.target.value)} value={proCategory} required>
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
                        <div className="row">
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="p_original_price" className='label'>Product Original Price: <s className='text-danger'>550</s></label>
                                <input type="text" id='p_original_price' className='inputField' required onChange={e => setOriginalPrice(e.target.value)} value={originalPrice} />
                            </div>
                            <div className="mb-3 col-lg-6 col-md-12 col-sm-12">
                                <label htmlFor="p_selling_price" className='label'>Product Selling Price: <mark>500</mark></label>
                                <input type="text" id='p_selling_price' className='inputField' required onChange={e => setSellingPrice(e.target.value)} value={sellingPrice} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img1" className='label'>Image 1</label>
                            <input type="file" id='img1' className='inputField' ref={img1Ref} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img2" className='label'>Image 2</label>
                            <input type="file" id='img2' className='inputField' ref={img2Ref} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="img3" className='label'>Image 3</label>
                            <input type="file" id='img3' className='inputField' ref={img3Ref} />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Product Uploading<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Save & Publish Product"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
