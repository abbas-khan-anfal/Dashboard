import React from 'react';

const Typography = () => {
    return (
        <div className="container">
            <div className="row">

                <div className="col-6">
                    <form action="" className='dashboardForm'>
                        <div className="mb-2">
                            <label htmlFor="email" className='label'>Email</label>
                            <input type="email" id='email' className='inputField' />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="textarea">TextArea</label>
                            <textarea id="textarea" className='inputField' rows={6}></textarea>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="fileinput">File Input</label>
                            <input type="file" id='fileinput' className='inputField' />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="selectBox">Select Box</label>
                            <select name="" className='inputField selectBox'>
                                    <option value="" selected>Html</option>
                                    <option value="">Javascript</option>
                                    <option value="" selected>Html</option>
                                    <option value="">Javascript</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="col-6">
                    <h3 className='mb-2'>Buttons</h3>
                    <button className='lg_btn'>Lg Button</button>
                    <hr></hr>
                    <button className='md_btn'>Md Button</button>
                    <hr></hr>
                    <button className='sm_btn'>Sm Button</button>
                </div>

                <div className="col-6">
                    <h3 className='mb-2'>Buttons</h3>
                    <a href="" className='anchorBtn1'>Anchor Button</a>
                </div>



                <div className="col-6">
                    <h3 className='mb-2'>Headings</h3>
                    <hr></hr>
                    <h2 className='h2_h'>heading1</h2>
                    <h4 className='h4_h'>heading4</h4>
                    <h5 className='h5_h'>heading5</h5>
                </div>

                <div className="col-6">
                    <p className='p1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere modi numquam minima illum odit dolorum aut error eligendi!</p>

                    <p className='p2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere modi numquam minima illum odit dolorum aut error eligendi!</p>

                    <p className='p3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere modi numquam minima illum odit dolorum aut error eligendi!</p>
                </div>

            </div>
        </div>
    );
}

export default Typography;
