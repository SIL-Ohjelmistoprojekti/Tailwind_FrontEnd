// Tuo tarvittavat React-hookit
import React, { useState, useEffect, useRef } from 'react';
import '../index.css'; // styles
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa'; // React ikonit

// Rakenne kiitoradoisssa
const runwaysData = {
  Hyvinkää: [
    { direction: '04/22', length: 1260, width: 18, surface: 'asfaltti' },
    { direction: '12/30', length: 790, width: 15, surface: 'asfaltti/sora' },
  ],
  Nummela: [
    { direction: '04/22', length: 1200, width: 20, surface: 'asfaltti' },
    { direction: '09/27', length: 580, width: 8, surface: 'asfaltti' },
  ],
  // Kiitoteiden tietoja muilla kentillä
  Räyskälä: [
    { direction: '08L/26R', length: 800, width: 10, surface: 'asfaltti' },
    { direction: '08R/26L', length: 1020, width: 18, surface: 'asfaltti/sora' },
    { direction: '12L/30R', length: 1270, width: 18, surface: 'asfaltti/sora' },
    { direction: '12R/30L', length: 480, width: 10, surface: 'asfaltti' },
  ],
  HelsinkiVantaa: [
    { direction: '04R/22L', length: 4000, width: 60, surface: 'asfaltti' },
    { direction: '04L/22R', length: 3000, width: 45, surface: 'asfaltti' },
  ],
  HelsinkiMalmi: [
    { direction: '18/36', length: 1280, width: 30, surface: 'asfaltti (suljettu)' },
    { direction: '09/27', length: 1024, width: 30, surface: 'asfaltti (suljettu)' },
  ],
  Pori: [
    { direction: '12/30', length: 2999, width: 45, surface: 'asfaltti' },
  ],
  Kokkola: [
    { direction: '12/30', length: 3000, width: 45, surface: 'asfaltti' },
  ],
  Jyväskylä: [
    { direction: '13/31', length: 2600, width: 45, surface: 'asfaltti' },
  ],
  Seinäjoki: [
    { direction: '13/31', length: 2300, width: 45, surface: 'asfaltti' },
  ],
  Rovaniemi: [
    { direction: '07/25', length: 2500, width: 45, surface: 'asfaltti' },
  ],
  Oulu: [
    { direction: '12/30', length: 3000, width: 45, surface: 'asfaltti' },
  ],
  Lahti: [
    { direction: '08/26', length: 1500, width: 30, surface: 'asfaltti' },
  ],
  Kuopio: [
    { direction: '16/34', length: 2600, width: 45, surface: 'asfaltti' },
  ],
  Vaasa: [
    { direction: '12/30', length: 3000, width: 45, surface: 'asfaltti' },
  ],
  Mariehamn: [
    { direction: '10/28', length: 1800, width: 30, surface: 'asfaltti' },
  ],
};

const AirportRunways = () => {
  const [currentAirport, setCurrentAirport] = useState('Hyvinkää');
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref valikon ulkopuoliselle klikkaukselle
  const [timeoutId, setTimeoutId] = useState(null); // Aikakatkaisija valikon sulkemista varten


  const handleAirportChange = (airport) => {
    setCurrentAirport(airport);
    setIsMenuOpen(false);  // Sulje valikko mobiilissa kun lentokenttä valitaan
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsHovered(true);
    setIsMenuOpen(true); // Open menu on hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHovered) {
        setIsMenuOpen(false); // Sulje valikko vain, jos hiiri ei ole valikossa
      }
    }, 200); // Viiveeen säätö
  };
  
  const toggleMenu = () => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(prev => !prev);
      if (isMenuOpen) {
        clearTimeout(timeoutId); // Poista aikakatkaisu, jos valikko suljetaan
      }
    }
  }; 
  
  const handleNext = () => {
    const airports = Object.keys(runwaysData);
    const currentIndex = airports.indexOf(currentAirport);
    const nextIndex = (currentIndex + 1) % airports.length;
    setCurrentAirport(airports[nextIndex]);
  };

  const handlePrevious = () => {
    const airports = Object.keys(runwaysData);
    const currentIndex = airports.indexOf(currentAirport);
    const prevIndex = (currentIndex - 1 + airports.length) % airports.length;
    setCurrentAirport(airports[prevIndex]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Sulje valikko, jos klikataan ulkopuolelle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderRunway = (runway) => {
    const [start, end] = runway.direction.split('/').map(dir => parseInt(dir.replace(/[LR]/, ''), 10));
    const startAngle = ((start * 10) / 360) * 2 * Math.PI;
    const endAngle = ((end * 10) / 360) * 2 * Math.PI;
    const startX = 150 + 120 * Math.cos(startAngle);
    const startY = 150 - 120 * Math.sin(startAngle);
    const endX = 150 + 120 * Math.cos(endAngle);
    const endY = 150 - 120 * Math.sin(endAngle);

    return (
      <g key={runway.direction}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="rgba(128, 128, 128, 0.7)"
          strokeWidth="20"
          strokeLinecap="round"
        />
      </g>
    );
  };

  const x = 150 + 100 * Math.cos((angle * Math.PI) / 180);
  const y = 150 - 100 * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center p-4 whitespace-nowrap">
     <h3 
    className="text-lg font-semibold mb-2 flex items-center cursor-pointer"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={toggleMenu} // Tämä rivi mahdollistaa valikon avaamisen klikkauksella
  >
    Kiitotiet
    <span className="ml-2 ">
      {isHovered || isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
    </span>
  </h3>

  <div
    ref={menuRef}
    className="relative" // relative että alasvetovalikko avautuu oikein
  >

       {/* Näytetään nykyisen lentokentän nimi ja Posan erikoisuus kun ei muuta keksi miten lisätä viivaa ja välikköö muuttujiin */}
      <h1 className="text-xl font-bold mb-2 whitespace-nowrap text-center">
        {currentAirport === 'HelsinkiVantaa' ? 'Helsinki-Vantaa' : currentAirport === 'HelsinkiMalmi' ? 'Helsinki Malmi' : currentAirport} Lentokenttä
      </h1>

        {(isHovered || isMenuOpen) && (
          <div className="absolute top-[-7px] left-0 mt-0 w-full bg-white border rounded shadow-lg z-10">
            <div className="flex justify-between items-center p-2 bg-gray-200">
              <span>Valitse lentokenttä</span>
              <FaTimes
    onClick={() => setIsMenuOpen(false)}
    className="absolute right-2 top-2 cursor-pointer z-50" 
  />
            </div>
            
            {Object.keys(runwaysData).map((airport) => (
              <div
                key={airport}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleAirportChange(airport)}
              >
                {airport}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative mb-4">
        <svg width="300" height="300" className="border rounded-full">
          <circle cx="150" cy="150" r="120" stroke="pink" strokeWidth="3" fill="none" />
          <circle cx="150" cy="150" r="100" stroke="gray" strokeWidth="1" fill="none" />
          {runwaysData[currentAirport].map((runway) => renderRunway(runway))}
          <rect x={x - 10} y={y - 10} width="20" height="20" fill="rgba(0, 0, 255, 0.5)" />
          <line x1="150" y1="50" x2="150" y2="250" stroke="red" strokeWidth="1" strokeDasharray="4" />
          <line x1="50" y1="150" x2="250" y2="150" stroke="red" strokeWidth="1" strokeDasharray="4" />
          {[...Array(36)].map((_, i) => (
            <text key={i}
              x={150 + 110 * Math.cos((i * 10 * Math.PI) / 180)}
              y={150 - 110 * Math.sin((i * 10 * Math.PI) / 180)}
              fontSize="10"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {i * 10 === 0 ? '0\u00B0/360\u00B0' : `${i * 10}\u00B0`}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex space-x-4 mb-4">
        <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edellinen
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Seuraava
        </button>
      </div>

      {/* Lentokentän kiitotiet */}
      <div className="text-sm">
        {runwaysData[currentAirport].map((runway, index) => (
          <div key={index} className="text-center mb-2">
            <div className="font-bold">Suunta {runway.direction}</div>
            <div>Pituus: {runway.length} m, Leveys: {runway.width} m</div>
            <div>Pintamateriaali: {runway.surface}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirportRunways;
