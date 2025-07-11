import React, { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import AuthContext from '../../../../context/AuthProvider/AuthContext';
import Loader from '../../../../components/Loaders/Loader';

const Home = () => {

    const {dashUser} = useContext(AuthContext);
    const [products, setProducts] = useState(0);
    const [productCategories, setProductCategories] = useState(0);
    const [posts, setPosts] = useState(0);
    const [postCategories, setPostCategories] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [messages, setMessages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchAllDataForDashboard = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboardhome/home`, {
                withCredentials : true
            });
            setProducts(response?.data?.data?.products);
            setProductCategories(response?.data?.data?.proCategories);
            setPosts(response?.data?.data?.posts);
            setPostCategories(response?.data?.data?.postCategories);
            setTotalUsers(response?.data?.data?.users);
            setMessages(response?.data?.data?.messages);
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
        fetchAllDataForDashboard();
    },[]);   

    if(loading) return <div className="p-5">
        <Loader width="45px" height="45px" />
    </div>

    return (
        <div className="container dashboardHome my-4">
            <div className="row">

            {
                dashUser && dashUser.role === "admin"
                ?
                (
                    <>
                        <div className="col-3">
                            <div className="card mainCard card1">
                                <h6>All Products</h6>
                                <h1>{products ? products : "0"}</h1>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card mainCard card2">
                                <h6>Product Categories</h6>
                                <h1>{productCategories ? productCategories : "0"}</h1>
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="card mainCard card3">
                                <h6>All Posts</h6>
                                <h1>{posts ? posts : "0"}</h1>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card mainCard card4">
                                <h6>Post Categories</h6>
                                <h1>{postCategories ? postCategories : "0"}</h1>
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="card mainCard card5">
                                <h6>Total Users</h6>
                                <h1>{totalUsers ? totalUsers : "0"}</h1>
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="card mainCard card5">
                                <h6>Total Messages</h6>
                                <h1>{messages ? messages : "0"}</h1>
                            </div>
                        </div>
                    </>
                )
                :
                (
                    <>
                        <div className="col-3">
                            <div className="card mainCard card1">
                                <h6>All Products</h6>
                                <h1>{products ? products : "0"}</h1>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card mainCard card3">
                                <h6>All Posts</h6>
                                <h1>{posts ? posts : "0"}</h1>
                            </div>
                        </div>
                    </>
                )
            }

            </div>

            <div className="row">

                <div className="col-6">
                    <div className="card chatCard">
                        
                    <Line
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                            datasets: [{
                                label: 'My First Dataset',
                                data: [65, 59, 80, 81, 56, 55, 40],
                                fill: false,
                                borderColor: '#14213d',
                                backgroundColor: '#fca311',
                                tension: 0
                            }]
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Revenue',
                                    color: '#14213d',
                                    font: {
                                        size: 18
                                    }
                                }
                            }
                        }}
                    />
                    </div>
                </div>

                <div className="col-6">
                    <div className="card chatCard">
                        
                    <Bar
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                            datasets: [{
                                label: 'My First Dataset',
                                data: [65, 59, 80, 81, 56, 55, 40],
                                fill: false,
                                borderColor: '#14213d',
                                backgroundColor: ['#14213d', '#fca311'],
                                tension: 0
                            }]
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Revenue',
                                    color: '#14213d',
                                    font: {
                                        size: 18
                                    }
                                }
                            }
                        }}
                    />
                    </div>
                </div>


                <div className="col-4">
                    <div className="card chatCard">
                            <Doughnut
                                    data={{
                                        labels: ['Last month','kk'],
                                        datasets: [{
                                            label: 'Total Sales',
                                            data: [30, 80],
                                            fill: false,
                                            borderColor: '#14213d',
                                            backgroundColor: ['#14213d', '#fca311'],
                                            tension: 0
                                        }]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Sales',
                                                color: '#14213d',
                                                font: {
                                                    size: 18
                                                }
                                            }
                                        }
                                    }}
                                />
                    </div>
                </div>


                <div className="col-8">
                    <div className="card chatCard">
                        <h5 className='h5_h'>Transaction</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sr:no</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bhata shoe</td>
                                    <td>$ 550</td>
                                    <td>3/9/2024</td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bhata shoe</td>
                                    <td>$ 550</td>
                                    <td>3/9/2024</td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bhata shoe</td>
                                    <td>$ 550</td>
                                    <td>3/9/2024</td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bhata shoe</td>
                                    <td>$ 550</td>
                                    <td>3/9/2024</td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bhata shoe</td>
                                    <td>$ 550</td>
                                    <td>3/9/2024</td>
                                </tr>
                            </tbody>
                        </table>
                        <a href="#" className="lg_btn text-center">View All Transactions</a>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Home;
