import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../../../context/AuthProvider/AuthContext';
import Loader from '../../../../components/Loaders/Loader';

const Users = () => {
    const navigate = useNavigate();

    const { dashUser } = useContext(AuthContext);
    const [dashboardUsers, setDashboardUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dltUserId, setDltUserId] = useState("");
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchUsers = async (pageId) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/fetchall?page=${pageId}`, {
                withCredentials : true
            });
            setDashboardUsers(response.data.users);
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

    const deleteUserHandler = async (userId) => {
        setBtnLoading(true);
        setDltUserId(userId);
        try
        {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/deleteuser/${userId}`, {
                withCredentials : true
            });
            toast.success(response?.data?.message || "User deleted successfully");
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || error.message);
        }
        finally
        {
            setBtnLoading(false);
            fetchUsers(currentPage);
        }
    }

    const handlePage = (page) => {
        if (page >= 1 && page <= totalPages)
        {
            setCurrentPage(page);
        }
    }

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>
    
    return (
        <div className="container">
            <div className="row boxShadow my-2">

                <div className="col-12 mb-3 d-flex justify-content-between">
                    <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Dashboard Users</h4>
                    <NavLink to='/admin/dashboard-users/add-user' className="sm_btn">Add New User</NavLink>
                </div>

                <div className="col-6 table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope='col'>Sr: No</th>
                                <th scope='col'>Username</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Role</th>
                                <th scope='col'>Update</th>
                                <th scope='col'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                dashboardUsers.length > 0
                                ?
                                (
                                    dashboardUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td><b>{index + 1 + (currentPage - 1) * 3}</b></td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td><NavLink to={`/admin/dashboard-users/update-user/${user._id}`}className='editBtn'><i className="fa-solid fa-pen-to-square"></i></NavLink></td>
                                            {
                                                user._id.toString() === dashUser._id.toString()
                                                ?
                                                (
                                                    <td><button className='btn btn-danger' disabled><i className="fa-solid fa-trash"></i></button></td>
                                                )
                                                :
                                                (
                                                    <td>

                                                        <button disabled={btnLoading} className='btn btn-danger' onClick={() => deleteUserHandler(user._id)}>
                                                        {
                                                        btnLoading 
                                                        ? 
                                                        (
                                                           dltUserId && dltUserId.toString() === user._id.toString()
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
                                                    
                                                )
                                               
                                            }
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
                                    <button className="page-link disabled">Prev</button>
                                )
                                :
                                (
                                    <button onClick={() => setCurrentPage(Number(currentPage) - 1)} className={`page-link ${currentPage == 1 ? "disabled":""}`}>Prev</button>
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
                                    <button onClick={() => setCurrentPage(Number(currentPage) + 1)} className={`page-link ${currentPage < totalPages ? "":"disabled"}`}>Next</button>
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

export default Users;
