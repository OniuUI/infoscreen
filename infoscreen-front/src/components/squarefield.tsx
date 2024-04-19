// src/components/SquareField.tsx
import React from 'react';

interface SquareFieldProps {
    className?: string;
    children: React.ReactNode;
}

const SquareField: React.FC<SquareFieldProps> = ({ className, children }) => {
    return (
        <div className={className}>
            {children}
        </div>
        );
};

export default SquareField;
