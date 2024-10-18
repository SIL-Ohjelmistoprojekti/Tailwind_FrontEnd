// Tuo tarvittavat React-hookit
import React, { useState, useEffect } from 'react';
// Tuo tyylitiedosto
import '../index.css'; // styles

// Määritellään tietorakenne lentokenttien kiitoteistä
const runwaysData = {
  Hyvinkää: [
    { direction: '04/22', length: 1260, width: 18, surface: 'asfaltti' },
    { direction: '12/30', length: 790, width: 15, surface: 'asfaltti/sora' },
  ],
  Nummela: [
    { direction: '04/22', length: 1200, width: 20, surface: 'asfaltti' },
    { direction: '09/27', length: 580, width: 8, surface: 'asfaltti' },
  ],
  // Lisää kiitoteiden tiedot muille lentokentille
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

// Komponentti, joka näyttää lentokenttien kiitotiet
const AirportRunways = () => {
  // State muuttujat nykyiselle lentokentälle ja kulmalle
  const [currentAirport, setCurrentAirport] = useState('Hyvinkää');
  const [angle, setAngle] = useState(0); // Liikkuvan lohkon kulma

  // Effect hook, joka päivittää liikkuvan lohkon kulmaa
  useEffect(() => {
    // Asetetaan intervalli, joka päivittää kulmaa
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 1) % 360); // Kääntää 1 astetta joka 50 ms
    }, 50);
    // Palautetaan funktio, joka puhdistaa intervallin
    return () => clearInterval(interval);
  }, []); // Tyhjät riippuvuudet, joten effect ajetaan vain kerran

  // Käsitellään seuraava lentokenttä
  const handleNext = () => {
    const airports = Object.keys(runwaysData); // Hanki kaikki lentokenttien nimet
    const currentIndex = airports.indexOf(currentAirport); // Nykyisen lentokentän indeksi
    const nextIndex = (currentIndex + 1) % airports.length; // Seuraavan kentän indeksi
    setCurrentAirport(airports[nextIndex]); // Päivitä nykyinen lentokenttä
  };

  // Käsitellään edellinen lentokenttä
  const handlePrevious = () => {
    const airports = Object.keys(runwaysData); // Hanki kaikki lentokenttien nimet
    const currentIndex = airports.indexOf(currentAirport); // Nykyisen lentokentän indeksi
    const prevIndex = (currentIndex - 1 + airports.length) % airports.length; // Edellisen kentän indeksi
    setCurrentAirport(airports[prevIndex]); // Päivitä nykyinen lentokenttä
  };

  // Funktio, joka renderöi kiitotien SVG:ssä
  const renderRunway = (runway) => {
    // Jaetaan kiitotien suunta alkusuuntaan ja loppusuuntaan
    const [start, end] = runway.direction.split('/').map(dir => {
      return parseInt(dir.replace(/[LR]/, ''), 10); // Poista L ja R ja muunna kokonaisluvuksi
    });

    // Lasketaan kulmat kiitotien alkupäälle ja loppupäälle
    const startAngle = ((start * 10) / 360) * 2 * Math.PI;
    const endAngle = ((end * 10) / 360) * 2 * Math.PI;

    // Lasketaan alkupään ja loppupään koordinaatit
    const startX = 150 + 120 * Math.cos(startAngle);
    const startY = 150 - 120 * Math.sin(startAngle);
    const endX = 150 + 120 * Math.cos(endAngle);
    const endY = 150 - 120 * Math.sin(endAngle);

    return (
      // Renderöi kiitotie SVG-elementtinä
      <g key={runway.direction}>
        <line
          x1={startX} // Alkupään x-koordinaatti
          y1={startY} // Alkupään y-koordinaatti
          x2={endX}   // Loppupään x-koordinaatti
          y2={endY}   // Loppupään y-koordinaatti
          stroke="rgba(128, 128, 128, 0.7)" // Viivan väri
          strokeWidth="20" // Viivan paksuus
          strokeLinecap="round" // Viivan päätytyyli
        />
      </g>
    );
  };

  // Lasketaan liikkuvan lohkon koordinaatit kulman mukaan
  const x = 150 + 100 * Math.cos((angle * Math.PI) / 180);
  const y = 150 - 100 * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center p-4">
      {/* Näytetään kiitotiet otsikko */}
      <h3 className="text-lg font-semibold mb-2">Kiitotiet</h3>
      {/* Näytetään nykyisen lentokentän nimi ja Posan erikoisuus kun ei muuta keksi miten lisätä viivaa ja välikköö muuttujiin */}
      <h1 className="text-xl font-bold mb-2 whitespace-nowrap text-center">
        {currentAirport === 'HelsinkiVantaa' ? 'Helsinki-Vantaa' : currentAirport === 'HelsinkiMalmi' ? 'Helsinki Malmi' : currentAirport} Lentokenttä
      </h1>
      <div className="relative mb-4">
        {/* Netin mukaan tää on svg eleementti, eli ympyrä periaattessa */}
        <svg width="300" height="300" className="border rounded-full">
          <circle cx="150" cy="150" r="120" stroke="pink" strokeWidth="3" fill="none" /*Suurempi ympyrä. Kannattaa varoo jos tähän lisää kommenttei. Ei oikee helppo paikka lisätä mitään.*//> 
          <circle cx="150" cy="150" r="100" stroke="gray" strokeWidth="1" fill="none"/*Pienempi ympyrä*/ /> 
          
          {/* Renderöidään nykyisen lentokentän kiitotiet */}
          {runwaysData[currentAirport].map((runway) => renderRunway(runway))}
          
          {/* Renderöidään liikkuva lohko */}
          <rect
            x={x - 10} // Lohkon vasemman yläkulman x-koordinaatti
            y={y - 10} // Lohkon vasemman yläkulman y-koordinaatti
            width="20" // Lohkon leveys
            height="20" // Lohkon korkeus
            fill="rgba(0, 0, 255, 0.5)" // Lohkon väri
          />

          {/* Piirretään punaiset viivat, jotka osoittavat pohjoisen ja etelän */}
          <line x1="150" y1="50" x2="150" y2="250" stroke="red" strokeWidth="1" strokeDasharray="4" />
          <line x1="50" y1="150" x2="250" y2="150" stroke="red" strokeWidth="1" strokeDasharray="4" />

          {/* Renderöidään asteikko 0-360° */}
          {[...Array(36)].map((_, i) => (
            <text
              key={i}
              x={150 + 110 * Math.cos((i * 10 * Math.PI) / 180)} // Asteikon x-koordinaatti
              y={150 - 110 * Math.sin((i * 10 * Math.PI) / 180)} // Asteikon y-koordinaatti
              fontSize="10" // Fontin koko
              textAnchor="middle" // Tekstin keskittäminen
              alignmentBaseline="middle" // Tekstin vertikaalinen keskittymisen asettaminen
            >
              {i * 10 === 0 ? '0\u00B0/360\u00B0' : `${i * 10}\u00B0` /*// Näytetään asteluku. Taas huono paikka kommentteihin. Varokaa jos lisäätte jotain*/ } 
            </text>
          ))}
        </svg>
      </div>

      {/* Navigointipainikkeet */}
      <div className="flex space-x-4 mb-4">
        <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edellinen
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Seuraava
        </button>
      </div>

      {/* Kiitotien yksityiskohtien näyttäminen */}
      <div className="flex flex-col items-center space-y-2 text-sm">
        {runwaysData[currentAirport].map((runway, index) => (
          <div key={index} className="text-center">
            <div className="font-bold">Suunta {runway.direction + '\u00B0'}</div>
            <div>Pituus: {runway.length} m, Leveys: {runway.width} m</div>
            <div>Pintamateriaali: {runway.surface}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// PErinteinen exportti
export default AirportRunways;
