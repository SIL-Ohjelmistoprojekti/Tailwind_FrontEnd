import React, {useContext} from 'react';
import {UnitContext} from '../context/UnitContext.jsx';

const UnitToggle = () => {
    const {unit, toggleUnit} = useContext(UnitContext);

    return <button onClick={toggleUnit} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
    </button>;
};

export default UnitToggle;