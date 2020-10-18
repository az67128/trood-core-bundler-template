import React from 'react';
import './style.css';

const Modal = ({ isOpen, children, close }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            {children}
            <div>
                <button onClick={close}>close</button>
            </div>
        </div>
    );
};

export default Modal;