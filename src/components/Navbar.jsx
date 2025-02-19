import React, {useState} from 'react';
import {Link} from 'react-scroll';
import '../index.css';
import './WeatherForecast.jsx';
import './AirportRunways.jsx';
import './CurrentWeather.jsx';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative md:hidden z-50"> {/* Piilotetaan navbar suuremmilla näytöillä ja asetetaan z-index */}
            <div className="fixed top-0 left-0 p-4 z-50"> {/* Asetetaan navbar vasemmalle ylös ja lisätään z-index */}
                <button onClick={toggleMenu} className="text-3xl">
                    ☰ {/* Hamburger icon */}
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-white w-1/2 h-full shadow-lg z-50 transition-transform duration-300">
                    <div className="flex justify-end p-4">
                        <button onClick={closeMenu} className="text-3xl">
                            × {/* X icon */}
                        </button>
                    </div>
                    <ul className="list-none p-0">
                        <li className="p-4 text-center relative group">
                            <Link to="current-weather" smooth={true} duration={500} onClick={closeMenu}
                                  className="text-lg cursor-pointer">Current Weather</Link>
                            <span
                                className="absolute left-0 bottom-0 w-full h-1 bg-[#18B7BE] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                        </li>
                        <li className="p-4 text-center relative group">
                            <Link to="runways" smooth={true} duration={500} onClick={closeMenu}
                                  className="text-lg cursor-pointer">Runways</Link>
                            <span
                                className="absolute left-0 bottom-0 w-full h-1 bg-[#18B7BE] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                        </li>
                        <li className="p-4 text-center relative group">
                            <Link to="forecast" smooth={true} duration={500} onClick={closeMenu}
                                  className="text-lg cursor-pointer">Weather forecast</Link>
                            <span
                                className="absolute left-0 bottom-0 w-full h-1 bg-[#18B7BE] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                        </li>
                    </ul>
                </div>
            )}
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={closeMenu}></div>}
        </div>
    );
};

export default Navbar;
