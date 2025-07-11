import React from 'react';
import './Loader.css';

function Loader({width, height, border, margin}) {
  return (
    <span className="loader" style={{width:`${height}`, height:`${height}`, border : `${border}`, margin : `${margin}`}}></span>
  )
}

export default Loader;