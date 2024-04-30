import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <>
      <div className="modal">
        <div className="overlay"></div>
        <div className='modal-content'>
          <div className='loader'>
          </div>
          </div>
      </div>
    </>

  )
}

export default Loader