import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const UpdateProCat = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState({});
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchSingleCategory = async (cId) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/productcategory/singlecategory/${cId}`, {
                withCredentials : true
            });
            setCategory(response.data.category);
            setCategoryName(response.data.category.c_name);
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
        if(categoryName.trim() === "")
        {
            toast.error("Category name is required");
            return;
        }

        setBtnLoading(true);
        try
        {
            const updateData = {id : category._id, c_name : categoryName.toLowerCase()};
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/productcategory/update`, updateData , {
                headers : {
                    'Content-Type' : 'application/json'
                },
                withCredentials : true
            });
            toast.success(response.data.message || "Category updated successfullyy");
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
            toast.error("Category not found");
            return;
        }
        fetchSingleCategory(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="conatiner">
            <div className="row justify-content-center boxShadow">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    {
                        Object.keys(category).length > 0
                        ?
                        (
                            <form action="" className='dashboardForm' onSubmit={submitHandler}>
                                <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Update Product Category</h4>
                                <div className="mb-3">
                                    <label htmlFor="proCatName" className='label'>Category Name</label>
                                    <input type="text" id='proCatName' className='inputField' onChange={e => setCategoryName(e.target.value)} value={categoryName} />
                                </div>
                                <div className="mb-3">
                                     <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Category Updating<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Update"}</button>
                                </div>
                            </form>
                        )
                        :
                        (
                            <div className='dashboardForm'>
                                <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Update Product Category</h4>
                                <span>No data found</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default UpdateProCat;
