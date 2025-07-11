import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const ForgotPass = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-12 my-5">
                    <form action="" className='dashboardForm'>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> Forgot Password</h4>
                        <div className="mb-3">
                            <label htmlFor="email" className='label'>Enter your email</label>
                            <input type="email" required id='email' className='inputField' />
                        </div>
                        <div className="mb-3">
                            <button type='submit' className='md_btn'>Send OTP</button>
                        </div>
                        <div className="mb-3">
                        <NavLink to="/admin/login" className='anchorBtn1'>Back to login</NavLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPass;
