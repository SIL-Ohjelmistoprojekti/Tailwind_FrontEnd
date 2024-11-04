import React, {createContext, useState} from 'react';
import PropTypes from 'prop-types';

export const UnitContext = createContext();

export const UnitProvider = ({children}) => {
    const [unit, setUnit] = useState('metric');

    const toggleUnit = () => {
        setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    };

    return (
        <UnitContext.Provider value={{unit, toggleUnit}}>
            {children}
        </UnitContext.Provider>
    );
};

// Define PropTypes for UnitProvider
UnitProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
