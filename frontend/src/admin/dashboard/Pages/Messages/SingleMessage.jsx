import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../../components/Loaders/Loader';

const SingleMessage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(true);

    const goBack = () => {
        navigate(-1);
    };

    const fetchSingleMessageHandler = async (mId) => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/fetchsinglemsg?id=${mId}`, {
                withCredentials : true
            });
            setMessage(response.data.message);
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
        fetchSingleMessageHandler(id);
    },[id]);

    if(loading) return <div className="p-5 justify-content-center">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container">
            <div className="row dashBox dashsingleproduct my-1">
                {
                    message && Object.keys(message).length > 0
                    ?
                    (
                        <div className="col-6">
                        <h4 className='h4_h'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Message Details</h4>
                            <h2 className='h5_h'>Full Name</h2>
                            <p>{message.fullName}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Email</h2>
                            <p>{message.email}</p>
                            <hr></hr>
                            <h2 className='h5_h'>Message</h2>
                            <p>{message.message}</p>

                            <h2 className='h5_h'>Time</h2>
                            <p>
                                {new Date(message.timestamp).toLocaleString()}
                                
                            </p>
                        </div>
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

export default SingleMessage;
