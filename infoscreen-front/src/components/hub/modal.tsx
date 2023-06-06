// src/components/Modal.tsx

import React, { ReactNode, MouseEvent } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    children: ReactNode;
    onClose: (event: MouseEvent) => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    const content = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        content,
        document.getElementById('modal-root') as Element
        );
};

export default Modal;
