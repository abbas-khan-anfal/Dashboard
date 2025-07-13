import React from 'react'
import { useNavigate } from 'react-router-dom'

function AppHome() {
  const navigate = useNavigate();
  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-6 pt-5">
                <button className='md_btn' onClick={() => navigate('/admin')}>Go To Dashboard</button>
            </div>
        </div>
    </div>
  )
}

export default AppHome