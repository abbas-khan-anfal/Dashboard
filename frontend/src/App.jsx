import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Admin from './admin/Admin';
import AuthContext from './context/AuthProvider/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppHome from './pages/Home/AppHome';

const App = () => {
  const navigate = useNavigate();

  return (
    <Router>
      <Toaster />
      
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/admin/*" element={<Admin/>} />
        <Route path="*" element={<div>Error 404 : page not found!</div>} />
      </Routes>
    </Router>
  );
}

export default App;
