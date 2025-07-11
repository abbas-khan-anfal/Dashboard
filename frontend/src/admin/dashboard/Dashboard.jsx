import React, { useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import logo from '../../assets/logo.png';
import UserAvatar from '../../assets/user.png';
import Typography from './Pages/Typography';
import AddProduct from './Pages/products/AddProduct';
import UpdateProduct from './Pages/products/UpdateProduct';
import AddProductCat from './Pages/products/AddProCat';
import Products from './Pages/products/Products';
import SingleProduct from './Pages/products/SingleProduct';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import ProductCategories from './Pages/products/ProductCategories';
import Messages from './Pages/Messages/Messages';
import Settings from './Pages/settings/Settings';
import UpdateProCat from './Pages/products/UpdateProCat';

import AddPost from './Pages/Posts/AddPost';
import UpdatePost from './Pages/Posts/UpdatePost';
import Posts from './Pages/Posts/Posts';
import SinglePost from './Pages/Posts/SinglePost';
import PostCategories from './Pages/Posts/PostCategories';
import AddPostCat from './Pages/Posts/AddPostCat';
import UpdatePostCat from './Pages/Posts/UpdatePostCat';
import Home from './Pages/Home/Home';
import EditProfile from './Pages/Profile/EditProfile';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthProvider/AuthContext';
import axios from 'axios';
import SingleMessage from './Pages/Messages/SingleMessage';
import NormalUsers from './Pages/Normal Users/Users';
import DashboardUsers from './Pages/Dash Users/Users';
import AddUser from './Pages/Dash Users/AddUser';
import UpdateUser from './Pages/Dash Users/UpdateUser';
import Loader from '../../components/Loaders/Loader';

const Dashboard = () => {
    const [dashNav, setDashNav] = useState(false);
    const [proDropDown, setProDropDown] = useState(false);
    const [postDropDown, setPostDropDown] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {setDashUserState, dashUser} = useContext(AuthContext);

    const dachNavHandler = () => {
        setDashNav(!dashNav);
    };

    const productDropdownHandler = () => {
        setProDropDown(!proDropDown);
    };

    const postDropdownHandler = () => {
        setPostDropDown(!postDropDown);
    };

    const logoutHandler = async () => {
        setLoading(true);
        try
        {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashuser/logout`, {
                withCredentials: true,
            });
            toast.success(response?.data?.message || "Logout successfull");
            setDashUserState(false);
            navigate("/admin/login");
        }
        catch(error)
        {
            console.log(error.response?.data?.message || error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    if(loading)
    {
        return (
            <div style={{display:'flex', justifyContent:'center',alignItems:'center', height:'100vh', width:'100%'}}>
                <Loader width="45px" height="45px" />
                <span className='d-inline-block mx-2'>Logging out...</span>
            </div>
        )
    }

    return (
        <>

        <div onClick={() => dachNavHandler()} className={`navBackground ${dashNav ? 'show' : ''}`}></div>

        <div className='dashboard'>
            <aside className={`${dashNav ? 'show' : ''} aside`}>
                <div className='sec1'>
                    <div className='logoDiv'>
                        <button className='dashCloseBtn' onClick={() => dachNavHandler()}>&#10005;</button>
                        <NavLink to="/admin/dashboard"><img src={logo} title='logo' alt="logo" /></NavLink>
                    </div>
                    <ul>
                        <li><NavLink to="/admin/dashboard"><i className="fa-solid fa-gauge dashlinkIcon"></i>Dashboard</NavLink></li>
                        <li onClick={() => productDropdownHandler()}>
                            <NavLink to="/admin/products"><i className="fa-solid fa-hand-holding-medical dashlinkIcon"></i>Products</NavLink>
                        </li>
                        {
                            dashUser && dashUser.role === "admin"
                            ?
                            (
                                <div className={`productDropDown ${proDropDown ? 'show' : ''}`}>
                                        {/* <NavLink to="/admin/products/addproduct">Add Product</NavLink> */}
                                        <NavLink to="/admin/products/productcategories">Product Categoreis</NavLink>
                                        {/* <NavLink to="/admin/products/addproductcategory">Add Product Category</NavLink> */}
                                </div>
                            )
                            :
                            (
                                <></>
                            )
                        }
                        <li onClick={() => postDropdownHandler()}>
                            <NavLink to="/admin/posts"><i className="fa-solid fa-pen-to-square dashlinkIcon"></i>Posts</NavLink>
                        </li>
                        {
                            dashUser && dashUser.role === "admin"
                            ?
                            (
                                <div className={`productDropDown ${postDropDown ? 'show' : ''}`}>
                                        {/* <NavLink to="/admin/posts/addpost">Add Post</NavLink> */}
                                        <NavLink to="/admin/posts/postcategories">Post Categoreis</NavLink>
                                        {/* <NavLink to="/admin/posts/addpostcategory">Add Post Category</NavLink> */}
                                </div>
                            )
                            :
                            (
                                <></>
                            )
                        }
                        {
                            dashUser && dashUser.role === "admin"
                            ?
                            (
                                <>
                                    <li><NavLink to="/admin/messages"><i className="fa-regular fa-message dashlinkIcon"></i>Messages</NavLink></li>
                                    <li><NavLink to="/admin/settings"><i className="fa-solid fa-gears dashlinkIcon"></i>Site Settings</NavLink></li>
                                    <li><NavLink to="/admin/normal-users"><i className="fa-solid fa-users dashlinkIcon"></i>Normal Users</NavLink></li>
                                    <li><NavLink to="/admin/dashboard-users"><i className="fa-solid fa-users-gear dashlinkIcon"></i>Dashboard Users</NavLink></li>
                                </>
                            )
                            :
                            (
                                <>
                                </>
                            )
                        }
                    </ul>
                </div>
                <div className='sec2'>
                    <button onClick={logoutHandler}><i className="fa-solid fa-arrow-right-from-bracket dashlinkIcon"></i>Logout</button>
                </div>
            </aside>
            <main>
                <nav>
                    <div className='dashboardHeadingDiv'>
                        <button onClick={() => dachNavHandler()} className='dashOpenBtn'>&#9776;</button>
                        <h5>Dashboard</h5>
                    </div>

                    <div className="dropdown dashboardDropdown">
                        <button className="dropDownBtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {
                                dashUser.userImgPath
                                ?
                                (
                                    <img src={dashUser.userImgPath} alt="user" />
                                )
                                :
                                (
                                    <img src={UserAvatar} alt="user" />
                                )
                            }
                        </button>
                        <ul className="dropdown-menu shadow">
                            <li><button className="dropdown-item" onClick={() => navigate("/admin/edit-profile")}><i className="fa-solid fa-arrow-right-from-bracket"></i> Edit Profile</button></li>
                        </ul>
                    </div>
                </nav>



                <section>
                    <Routes>
                        {/* dashboard home route */}
                        <Route path='/' element={<Navigate to='/admin/dashboard' />}/>
                        <Route path='/dashboard' element={<Home/>}/>


                        {/* product routes */}
                        <Route path='/products/addproduct' element={<AddProduct/>}/>
                        <Route path='/products/updateproduct/:id' element={<UpdateProduct/>}/>
                        <Route path='/products/productcategories' element={<ProductCategories/>}/>
                        <Route path='/products/addproductcategory' element={<AddProductCat/>}/>
                        <Route path='/products' element={<Products/>}/>
                        <Route path='/products/singleproduct' element={<SingleProduct/>}/>
                        <Route path='/products/updateproductcategory/:id' element={<UpdateProCat/>}/>
                        <Route path='/products/viewproduct/:id' element={<SingleProduct/>}/>


                        {/* post routes */}
                        <Route path='/posts/addpost' element={<AddPost/>}/>
                        <Route path='/posts/updatepost/:id' element={<UpdatePost/>}/>
                        <Route path='/posts/postcategories' element={<PostCategories/>}/>
                        <Route path='/posts/addpostcategory' element={<AddPostCat/>}/>
                        <Route path='/posts' element={<Posts/>}/>
                        <Route path='/posts/singlepost' element={<SinglePost/>}/>
                        <Route path='/posts/updatepostcategory/:id' element={<UpdatePostCat/>}/>
                        <Route path='/posts/viewpost/:id' element={<SinglePost/>}/>

                        {
                            dashUser && dashUser.role === "admin"
                            ?
                            (
                                <>
                                    {/* message route */}   
                                    <Route path='/messages' element={<Messages/>}/>
                                    <Route path='messages/viewmessage/:id' element={<SingleMessage/>}/>

                                    {/* settings route */}
                                    <Route path='/settings' element={<Settings/>}/>

                                    {/* normal users route */}
                                    <Route path='/normal-users' element={<NormalUsers/>}/>

                                    {/* dashboard users route */}
                                    <Route path='/dashboard-users' element={<DashboardUsers/>}/>
                                    <Route path='/dashboard-users/add-user' element={<AddUser/>}/>
                                    <Route path='/dashboard-users/update-user/:id' element={<UpdateUser/>}/>
                                </>
                            )
                            :
                            (
                                <> 
                                </>
                            )
                        }

                        {/* edit profile route */}
                        <Route path='/edit-profile' element={<EditProfile/>}/>

                        <Route path='*' element={<Navigate to='/admin/dashboard' />}/>

                        <Route path='/typography' element={<Typography/>}/>
                    </Routes>
                </section>

            </main>
        </div>
        </>
    );
}

export default Dashboard;
