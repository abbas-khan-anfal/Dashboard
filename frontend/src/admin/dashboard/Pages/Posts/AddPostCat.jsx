import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const AddPostCat = () => {

    const navigate = useNavigate();
    const [category, setCategory] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try
        {
            if(category.trim() === "")
            {
                toast.error("Please enter category name");
            }


            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/postcategory/add`,{c_name : category.toLowerCase()} ,{
                headers : {
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            });
            toast.success(response?.data?.message || "Category saved successfully");
            setCategory("");
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



    return (
        <div className="conatiner">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-sm-12 my-5">
                    <form action="" className='dashboardForm' onSubmit={submitHandler}>
                        <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Add Post Category</h4>
                        <div className="mb-3">
                            <label htmlFor="proCatName" className='label'>Category Name</label>
                            <input type="text" id='proCatName' onChange={e => setCategory(e.target.value)} value={category} required className='inputField' />
                        </div>
                        <div className="mb-3">
                            <button type='submit' disabled={btnLoading} className='md_btn'>{btnLoading ? <>Category Saving<Loader width="20px" height="20px" border="2px solid white" margin="0px 10px" /></> : "Save Category"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPostCat;
