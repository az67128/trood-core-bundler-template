import React from 'react';
const Spacer = ({ size = 8, className = '', vertical = false }) => {
    return (
        <div
            style={{ [vertical ? 'width' : 'height']: size, display: vertical ? 'inline-block' : 'block' }}
            className={className}
        />
    );
};

export default Spacer;
