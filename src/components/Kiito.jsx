// Tuo tarvittavat React-hookit
import React, {useEffect, useRef, useState} from 'react';
import '../index.css'; // styles
import {FaChevronDown, FaChevronUp, FaTimes} from 'react-icons/fa'; // React ikonit

// Rakenne kiitoradoisssa
const runwaysData = {
  Hyvinkää: [
    { direction: '04/22', length: 1260, width: 18, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '12/30', length: 790, width: 15, surface: 'asfaltti/sora', details: "työn alla.. polttiane.." },
  ],
  Nummela: [
    { direction: '04/22', length: 1200, width: 20, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '09/27', length: 580, width: 8, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Räyskälä: [
    { direction: '08L/26R', length: 800, width: 10, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '08R/26L', length: 1020, width: 18, surface: 'asfaltti/sora', details: "työn alla.. polttiane.." },
    { direction: '12L/30R', length: 1270, width: 18, surface: 'asfaltti/sora', details: "työn alla.. polttiane.." },
    { direction: '12R/30L', length: 480, width: 10, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  HelsinkiVantaa: [
    { direction: '04R/22L', length: 4000, width: 60, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '04L/22R', length: 3000, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '12/30', length: 3600, width: 60, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Oulu: [
    { direction: '12/30', length: 3000, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '03/21', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '15/33', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  TamperePirkkala: [
    { direction: '12/30', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '03/21', length: 3200, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '15/33', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Rovaniemi: [
    { direction: '07/25', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.."},
    { direction: '01/19', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '13/31', length: 2500, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Lappeenranta: [
    { direction: '15/33', length: 2700, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '09/27', length: 1800, width: 30, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '12/30', length: 1200, width: 20, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  HelsinkiMalmi: [
    { direction: '18/36', length: 1280, width: 30, surface: 'asfaltti (suljettu)', details: "työn alla.. polttiane.." },
    { direction: '09/27', length: 1024, width: 30, surface: 'asfaltti (suljettu)', details: "työn alla.. polttiane.." },
  ],
  Pori: [
    { direction: '12/30', length: 2999, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Kokkola: [
    { direction: '01/19', length: 2500, width: 60, surface: 'asfaltti', details: "työn alla.. polttiane.." },
    { direction: '11/29', length: 700, width: 20, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Jyväskylä: [
    { direction: '13/31', length: 2600, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Seinäjoki: [
    { direction: '13/31', length: 2300, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Lahti: [
    { direction: '08/26', length: 1500, width: 30, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Kuopio: [
    { direction: '16/34', length: 2600, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Vaasa: [
    { direction: '12/30', length: 3000, width: 45, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
  Mariehamn: [
    { direction: '10/28', length: 1800, width: 30, surface: 'asfaltti', details: "työn alla.. polttiane.." },
  ],
};


const AirportRunways = () => {
  const [currentAirport, setCurrentAirport] = useState('Hyvinkää');
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref valikon ulkopuoliselle klikkaukselle
  const [timeoutId, setTimeoutId] = useState(null); // Aikakatkaisija valikon sulkemista varten

//liittyy kiitotien valitsemis valikkoon"
  const handleAirportChange = (airport) => {
    setCurrentAirport(airport);
    setIsMenuOpen(false);  // Sulje valikko mobiilissa kun lentokenttä valitaan
  };

  //Tietokoneella kiitotie valikon aukeaminen kun kursori on päällä
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsHovered(true);
    setIsMenuOpen(true); // Open menu on hover
  };
// valikon sulkeminen jos kursori poistuu kiitotiestä
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
  // seuraava buttoni
  const handleNext = () => {
    const airports = Object.keys(runwaysData);
    const currentIndex = airports.indexOf(currentAirport);
    const nextIndex = (currentIndex + 1) % airports.length;
    setCurrentAirport(airports[nextIndex]);
  };
// edellinen buttoni
  const handlePrevious = () => {
    const airports = Object.keys(runwaysData);
    const currentIndex = airports.indexOf(currentAirport);
    const prevIndex = (currentIndex - 1 + airports.length) % airports.length;
    setCurrentAirport(airports[prevIndex]);
  };

  // CHILLING NELIÖ koska se on aika must have ja siisti
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
   {/*Extract the runway directions (e.g., "04/22" becomes [4, 22]) ehk pitää korjata hiukan. koska lr on left right vissiin niin mitä jos eri ilman suunta. Mut koodi toimii */} 
    const directions = runway.direction.split('/').map(dir => parseInt(dir.replace(/[LR]/, ''), 10));
  
    return directions.map((dir, index) => {
      // Calculate the angle for the runway direction
      const angle = ((dir * 10) / 360) * 2 * Math.PI;
  
      // Calculate the endpoint of the line based on the angle
      const x = 150 + 120 * Math.cos(angle);  // 150 is the center of the circle, 120 is the radius
      const y = 150 - 120 * Math.sin(angle);  // Subtracting because y-axis is inverted in SVG
  
      return (
        <line
          key={`${runway.direction}-${index}`}  // Use direction and index as key
          x1={150} y1={150}  // Start from the center of the circle
          x2={x} y2={y}  // Draw the line to the calculated endpoint
          stroke="rgba(128, 128, 128, 0.7)"
          strokeWidth="20"
          strokeLinecap="round"
        />
      );
    });
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
    runway
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
        {currentAirport === 'HelsinkiVantaa' ? 'Helsinki-Vantaa' : currentAirport === 'HelsinkiMalmi' ? 'Helsinki Malmi' : currentAirport} Airport
      </h1>

        {(isHovered || isMenuOpen) && (
          <div className="absolute top-[-7px] left-0 mt-0 w-full bg-white border rounded shadow-lg z-10">
            <div className="flex justify-between items-center p-2 bg-gray-200">
              <span>Choose airport</span>
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
  {/* SVG-elementti, joka toimii piirtopohjana kiitoratojen visualisoinnille sekä siniselle neliölle */}
  <svg width="300" height="300" className="border rounded-full">
    
    {/* Ympyrä, jonka säde on 120 ja keskikohta (150, 150) eli SVG:n keskellä. Se toimii taustana visualisoinnille */}
    <circle cx="150" cy="150" r="120" stroke="pink" strokeWidth="3" fill="none" />
    
    {/* Toinen ympyrä sisempänä, säde 100, harmaa viiva. Myös tämä toimii taustaelementtinä */}
    <circle cx="150" cy="150" r="100" stroke="gray" strokeWidth="1" fill="none" />
    
    {/* Lentokentän nykyisten kiitoratojen visualisointi kutsumalla renderRunway-funktiota */}
    {runwaysData[currentAirport].map((runway) => renderRunway(runway))}
    
    {/* Alla sinisen neliön piirtäminen, joka liikkuu ympyrän kehällä. Sijainti määräytyy muuttujien `x` ja `y` mukaan */}
    <rect x={x - 10} y={y - 10} width="20" height="20" fill="rgba(0, 0, 255, 0.5)" />
    
    {/* Punainen katkoviiva pystysuunnassa keskeltä (150, 150) ylä- ja alareunaan (50 ja 250) */}
    <line x1="150" y1="50" x2="150" y2="250" stroke="red" strokeWidth="1" strokeDasharray="4" />
    
    {/* Punainen katkoviiva vaakasuunnassa keskeltä (150, 150) vasemmalta oikealle (50 ja 250) */}
    <line x1="50" y1="150" x2="250" y2="150" stroke="red" strokeWidth="1" strokeDasharray="4" />
    
    {/* Kierrosasteet 0°-360° lisätään ympyrän kehälle. `Array(36)` luo 36 kohtaa, jokainen 10° välein. 
    `Math.cos` ja `Math.sin` laskevat tekstin sijainnin ympyrän kehällä. */}
    {[...Array(36)].map((_, i) => (
      <text key={i}
        x={150 + 110 * Math.cos((i * 10 * Math.PI) / 180)}
        y={150 - 110 * Math.sin((i * 10 * Math.PI) / 180)}
        fontSize="10"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {/* Näytetään asteet ympyrän kehällä. 0° ja 360° ovat samassa kohdassa */}
        {i * 10 === 0 ? '0\u00B0/360\u00B0' : `${i * 10}\u00B0`}
      </text>
    ))}
  </svg>
</div>


      <div className="flex space-x-4 mb-4">
        <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Previous
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Next
        </button>
      </div>

      {/* Lentokentän kiitotiet lisäteksti osio */}
      <div className="text-sm">
        {runwaysData[currentAirport].map((runway, index) => (
          <div key={index} className="text-center mb-2">
            <div className="font-bold">Direction {runway.direction}</div>
            <div>Length: {runway.length} m, Leveys: {runway.width} m</div>
            <div>Surface: {runway.surface}</div>
            <div>Additional information: {runway.details} </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirportRunways;