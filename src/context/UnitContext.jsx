import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
    const [unit, setUnit] = useState('metric');

    useEffect(() => {
        // Read the unit from the cookie when the component mounts
        const savedUnit = Cookies.get('unit');
        if (savedUnit) {
            setUnit(savedUnit);
        }
    }, []);

    const toggleUnit = () => {
        setUnit((prevUnit) => {
            const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric';
            // Save the new unit to the cookie
            Cookies.set('unit', newUnit, { expires: 365 }); // Cookie expires in 1 year
            return newUnit;
        });
    };

    return (
        <UnitContext.Provider value={{ unit, toggleUnit }}>
            {children}
        </UnitContext.Provider>
    );
};

// Define PropTypes for UnitProvider
UnitProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
