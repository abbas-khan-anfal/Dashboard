import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = React.useState(false);
    const [dltProductId, setDltProductId] = useState("");

    const goBack = () => {
        navigate(-1);
    };

    const fetchProducts = async (page) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product/fetchproducts?page=${page}`, {
                withCredentials : true
            });
            setProducts(response.data.products);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
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

    const handlePage = (page) => {
        if (page >= 1 && page <= totalPages)
        {
            setCurrentPage(page);
        }
    }

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);


    
    const deleteProductHandler = async (productId) => {
        setBtnLoading(true);
        setDltProductId(productId);
        try
        {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/product/delete?id=${productId}`, {
                withCredentials : true
            });
            toast.success(response?.data?.message || "Post deleted successfully");
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message);
        }
        finally
        {
            setBtnLoading(false);
            fetchProducts(currentPage);
        }
    }

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row boxShadow my-2">

                <div className="col-12 mb-3 d-flex justify-content-between">
                    <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Posts</h4>
                    <NavLink to='/admin/products/addproduct' className="sm_btn">Add New Product</NavLink>
                </div>

                <div className="col-6 table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope='col'>Sr: No</th>
                                <th scope='col'>Product Name</th>
                                <th scope='col'>Product Category</th>
                                <th scope='col'>View</th>
                                <th scope='col'>Edit</th>
                                <th scope='col'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                products.length > 0
                                ?
                                (
                                    products.map((product, index) => (
                                        <tr key={index}>
                                            <td><b>{index + 1 + (currentPage - 1) * 3}</b></td>
                                            <td>{product.pro_title}</td>
                                            <td>{product.pro_qty}</td>
                                            <td><NavLink to={`/admin/products/viewproduct/${product._id}`} className='editBtn'><i className="fa-solid fa-eye"></i></NavLink></td>
                                            <td><NavLink to={`/admin/products/updateproduct/${product._id}`}className='editBtn'><i className="fa-solid fa-pen-to-square"></i></NavLink></td>
                                            <td>

                                                        <button disabled={btnLoading} className='btn btn-danger' onClick={() => deleteProductHandler(product._id)}>
                                                        {
                                                        btnLoading 
                                                        ? 
                                                        (
                                                           dltProductId && dltProductId.toString() === product._id.toString()
                                                            ?
                                                            <><Loader width="15px" height="15px" border="2px solid white" margin="0px" /></>
                                                            :
                                                            <i className="fa-solid fa-trash"></i>
                                                        )
                                                        : 
                                                        (
                                                        <i className="fa-solid fa-trash"></i>
                                                        )
                                                        }
                                                        </button>

                                            </td>
                                        </tr>
                                    ))
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan={5} className='text-center'>No Data Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>

                <div className="col-12">
                <ul className="pagination">
                        <li className="page-item">
                        {
                                currentPage == 1
                                ?
                                (
                                    <button className="page-link disabled">Next</button>
                                )
                                :
                                (
                                    <button onClick={() => setCurrentPage(currentPage - 1)} className={`page-link ${currentPage == 1 ? "disabled":""}`}>Prev</button>
                                )
                            }
                        </li>
                        {
                            [...Array(totalPages)].map((_, i) => (
                                <li className="page-item" key={i}>
                                    <button className={`page-link ${currentPage === i+1?"active":""}`} onClick={() => handlePage(i + 1)}>{i + 1}</button>
                                </li>
                            ))
                        }
                        <li className="page-item">
                            {
                                currentPage < totalPages
                                ?
                                (
                                    <button onClick={() => setCurrentPage(currentPage + 1)} className={`page-link ${currentPage < totalPages ? "":"disabled"}`}>Next</button>
                                )
                                :
                                (
                                    <button className="page-link disabled">Next</button>
                                )
                            }
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Products;
