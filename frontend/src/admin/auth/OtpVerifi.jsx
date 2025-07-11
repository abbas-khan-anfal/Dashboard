import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const OtpVerifi = () => {

    const navigate = useNavigate();
    const [otpNumber, setOtpNumber] = useState("");

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-12 my-5">
                    <form action="" className='dashboardForm'>
                        <h4 className='h4_h mb-3'><button className='dashBackBtn' type='button' onClick={goBack}><i className="fa-solid fa-arrow-left"></i></button> OTP Verification</h4>
                        <div className="mb-3">
                            <label htmlFor="otpInput" className='label'>Enter your OTP</label>
                            <input type="text" required id='otpInput' className='inputField' value={otpNumber} onChange={e => {setOtpNumber(e.target.value)}} />
                        </div>
                        <div className="mb-3">
                            <button type='submit' className='md_btn'>Verify OTP</button>
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

export default OtpVerifi;
