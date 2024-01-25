import React from 'react';
import './failedmodal.css'; // Make sure the path to your CSS file is correct

const FailedModal = ({ FailedMessage, onClose }) => {
  return (
    <div className="failedModalBackdrop">
      <div className="failedModalContent">
        <p className="failedModalMessage">{FailedMessage}</p>
        <button className="failedModalCloseButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FailedModal;
