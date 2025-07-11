import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loaders/Loader';

const Messages = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dltMsgId, setDltMsgId] = useState("");
    const [btnLoading, setBtnLoading] = React.useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchMessagesHandler = async (page) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/fetch?page=${page}`, {
                withCredentials : true
            });
            setMessages(response.data.messages);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
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

    const handlePageChange = (page) => {
        if(page >= 1 && page <= totalPages)
        {
            setCurrentPage(page);
        }
    };
    useEffect(() => {
        fetchMessagesHandler(currentPage);
    },[currentPage]);

    const deleteMessageHandler = async (messageId) => {
        setBtnLoading(true);
        setDltMsgId(messageId);
        try
        {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/message/delete?id=${messageId}`, {
                withCredentials : true
            });
            toast.success(response.data.message);
        }
        catch(error)
        {
            toast.error(error?.response?.data?.message || "Internal server error");
        }
        finally
        {
            setBtnLoading(false);
            fetchMessagesHandler(currentPage);
        }
    }

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row dashBox my-2">

                <div className="col-12 mb-3">
                    <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Messages</h4>
                </div>

                <div className="col-6 table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope='col'>Sr: No</th>
                                <th scope='col'>Full Name</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>View</th>
                                <th scope='col'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                messages.length > 0
                                ?
                                (
                                    messages.map((message, index) => {
                                        return (
                                            <tr key={index}>
                                                <td><b>{index + 1 + (currentPage - 1) * 3}</b></td>
                                                <td>{message.fullName}</td>
                                                <td>{message.email}</td>
                                                <td><NavLink to={`/admin/messages/viewmessage/${message._id}`} className='viewBtn'><i className="fa-solid fa-eye"></i></NavLink></td>
                                                <td>

                                                        <button disabled={btnLoading} className='btn btn-danger' onClick={() => deleteMessageHandler(message._id)}>
                                                        {
                                                        btnLoading 
                                                        ? 
                                                        (
                                                           dltMsgId && dltMsgId.toString() === message._id.toString()
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
                                        )
                                    })
                                
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan={6} className='text-center'>No messages found</td>
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
                                currentPage === 1 || currentPage < 1
                                ?
                                (
                                    <button className="page-link disabled">Previous</button>
                                )
                                :
                                (
                                    <button onClick={() => handlePageChange(currentPage - 1)} className={`page-link ${currentPage === 1 ? "disabled" : ""}`}>Previous</button>
                                )
                            
                            }
                        </li>
                        {
                            [...Array(totalPages)].map((_,i) => (
                                <li className="page-item" key={i}>
                                    <button className="page-link" onClick={() => handlePageChange(i+1)}>{i+1}</button>
                                </li>
                            ))
                        }
                        <li className="page-item">
                            {
                                currentPage === totalPages
                                ?
                                (
                                    <button className="page-link disabled">Next</button>
                                )
                                :
                                (
                                    <button onClick={() => handlePageChange(currentPage + 1)} className={`page-link ${currentPage === totalPages ? "disabled" : ""}`}>Next</button>
                                )
                            }
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Messages;
