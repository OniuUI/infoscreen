// src/components/SquareField.tsx
import React from 'react';

interface SquareFieldProps {
    children: React.ReactNode;
}

const SquareField: React.FC<SquareFieldProps> = ({ children }) => {
    return (
        <div className="square-field">
            {children}
        </div>
        );
};

export default SquareField;
