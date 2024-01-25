import React from 'react';
import './successmodal.css'; // Make sure the path to your CSS file is correct

const SuccessModal = ({ SuccessMessage, onClose }) => {
  return (
    <div className="successModalBackdrop">
      <div className="successModalContent">
        <p className="successModalMessage">{SuccessMessage}</p>
        <button className="successModalCloseButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
