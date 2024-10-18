import React, { useEffect, useState, useRef } from 'react'; 
import { FaInfoCircle, FaThermometerHalf, FaTimes } from 'react-icons/fa'; 
import '../index.css'; 

const SaaEnnuste = () => {
  // Tilamuuttujat säilyttävät säädataa ja komponentin tilaa
  const [weatherData, setWeatherData] = useState([]); // Säilyttää haetun säädatan
  const [loading, setLoading] = useState(true); // Indikoi lataustilaa
  const [updatedAt, setUpdatedAt] = useState(''); // Viimeksi päivitetty aika datalle
  const [city, setCity] = useState(''); // Kaupungin nimi, jolle data on haettu
  const [infoVisible, setInfoVisible] = useState({}); // Seuraa tietopoppien näkyvyyttä
  const [deviceType, setDeviceType] = useState('desktop'); // Havaitsee laitteen tyypin (desktop, tablet, mobile)
  const [expandedIndex, setExpandedIndex] = useState(null); // Hallitsee, mikä item on avattu
  const [expandedDateIndex, setExpandedDateIndex] = useState(null); // Hallitsee, mikä päivämääräjoukko on avattu
  const infoRef = useRef(null); // Ref ulkopuolisten klikkausten käsittelyä varten tietopop-upissa
  
  // Effect käsittelee näytön koon muutoksia ja määrittää laitteen tyypin
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { //mobla
        setDeviceType('mobile');
      } else if (width < 1024) { //tabletti
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop'); // tietsikka
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching weather data...');
        const apiUrl = 'https://api.met.no/weatherapi/subseasonal/1.0/complete?lat=60.6340&lon=24.8663';

        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'YourAppName/1.0',
          },
        });

        console.log('Raw Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log('Fetched Data:', jsonData);

        if (!jsonData || !jsonData.properties || !jsonData.properties.timeseries) {
          console.error('Data structure is not as expected:', jsonData);
          return;
        }

        const updatedTime = new Date(jsonData.properties.meta.updated_at);
        setUpdatedAt(updatedTime.toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' }));

        setCity('Hyvinkää');

        const extractedData = jsonData.properties.timeseries.slice(0, 14).map((item) => {
          const time = item.time;
          const details = item.data.next_24_hours.details;

          // Get the weekday from the date
          const weekday = new Date(time).toLocaleDateString('fi-FI', { weekday: 'long', timeZone: 'Europe/Helsinki' });
          const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1); // Capitalize first letter

          return {
            weekday: capitalizedWeekday, // Use capitalized weekday
            time: new Date(time).toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' }),
            temperatureMax: details.air_temperature_max !== undefined ? details.air_temperature_max : 'Ei dataa',
            temperatureMin: details.air_temperature_min !== undefined ? details.air_temperature_min : 'Ei dataa',
            precipitation: details.precipitation_amount !== undefined ? details.precipitation_amount : 'Ei dataa',
            frostProbability: details.probability_of_frost !== undefined ? details.probability_of_frost : 'Ei dataa',
          };
        });

        console.log('Extracted Data:', extractedData);
        setWeatherData(extractedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const info = {
    mobiili: "Viikkoja painamalla saat lisätietoa tulevista sääennusteista",
  };

  const infoTexts = {
    weekday: "Viikonpäivä",
    date: "Tämä päivämäärä tarkoittaa ennustettavaa säätä. Saatavilla oleva tieto voi muuttua.",
    maxTemp: "Ennustamalla arviout maksimi lämpötila",
    minTemp: "Minimi lämpötila",
    precipitation: "Sateen määrä millimetreinä",
    frostProbability: "Mahdollisuus pakkaselle prosentteina"
  };

  const handleMouseEnter = (key) => {
    setInfoVisible((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setInfoVisible((prev) => ({ ...prev, [key]: false }));
  };

  const startDate = weatherData.length > 0 ? weatherData[0].time : '';
  const endDate = weatherData.length > 0 ? weatherData[weatherData.length - 1].time : '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoVisible['mobiili'] && infoRef.current && !infoRef.current.contains(event.target)) {
        setInfoVisible((prev) => ({ ...prev, mobiili: false })); 
      }
    };

    if (infoVisible['mobiili']) {
      document.addEventListener('mousedown', handleClickOutside); 
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [infoVisible]);

  return (
    <div className="container mx-auto flex justify-end">
      {loading ? (
        <p className="text-lg">Ladataan dataa...</p>
      ) : (
        <div className={`w-full sm:w-3/4 md:w-2/4 lg:w-[75%] bg-gray-100 p-4 rounded-lg shadow-lg`}>
          {/*ylmepi säätää koko valikon leveyttä */}
          {weatherData.length === 0 ? (
            <p className="text-lg">Ei säädataa saatavilla.</p>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-1">
                Sääennuste 14 pvä <br/>{startDate} - {endDate}
                {deviceType === 'mobile' && (
                  <span className="inline-block relative group ml-2">
                    <FaInfoCircle
                      className="inline-block text-blue-500 cursor-pointer"
                      onClick={() => setInfoVisible((prev) => ({ ...prev, mobiili: !prev.mobiili }))} 
                    />
                    {infoVisible['mobiili'] && (
                      <div 
                        ref={infoRef} 
                        className={`absolute left-1/2 transform -translate-x-[calc(50%+20px)] mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10`}
                        >
                        <p>{info['mobiili']}</p>
                        <FaTimes
                          className="absolute top-1 right-1 text-red-500 cursor-pointer"
                          onClick={() => setInfoVisible((prev) => ({ ...prev, mobiili: false }))} 
                        />
                      </div>
                    )}
                  </span>
                )}
              </h2>

              {deviceType === 'desktop' ? (
                <div>
                  <div className="grid grid-cols-6 gap-3 font-bold mb-1"> {/* Changed to 6 columns */}
                    {Object.keys(infoTexts).map((key) => (
                      <div key={key} className="relative group">
                        <span className="flex items-center whitespace-nowrap">
                          {key === 'weekday' ? (
                            'Viikonpäivä'
                          ) : key === 'date' ? (
                            'Päivämäärä'
                          ) : key === 'maxTemp' ? (
                            <>Max <FaThermometerHalf /> (°C)</>
                          ) : key === 'minTemp' ? (
                            <>Min <FaThermometerHalf /> (°C)</>
                          ) : key === 'precipitation' ? (
                            'Sade (mm)'
                          ) : key === 'frostProbability' ? (
                            'Pakkanen(%)'
                          ) : null}
                        </span>

                        <FaInfoCircle
                          className="inline-block mt-1 text-blue-500 cursor-pointer"
                          onMouseEnter={() => handleMouseEnter(key)} 
                          onMouseLeave={() => handleMouseLeave(key)} 
                        />

                        {infoVisible[key] && (
                          <div
                            className={`absolute ${window.innerWidth >= 640 ? 'right-0 translate-x-full mr-36' : 'left-1/2 transform -translate-x-1/2'} mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10`}
                          >
                            <p>{infoTexts[key]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-6 gap-1 mb-1">
                    {weatherData.map((item, index) => (
                      <React.Fragment key={index}>
                        <span className="p-2 bg-gray-200 rounded">{item.weekday}</span>{/* Added weekday here */}
                        <span className="p-2 bg-gray-200 rounded">{item.time}</span>
                        <span className="p-2 bg-gray-200 rounded">{item.temperatureMax} °C</span>
                        <span className="p-2 bg-gray-200 rounded">{item.temperatureMin} °C</span>
                        <span className="p-2 bg-gray-200 rounded">{item.precipitation} mm</span>
                        <span className="p-2 bg-gray-200 rounded whitespace-nowrap">{item.frostProbability}%</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 font-bold mb-2">
                  {[0, 7].map((weekIndex) => {
                    const weekStart = new Date(new Date().setDate(new Date().getDate() + weekIndex));
                    const weekEnd = new Date(new Date(weekStart).setDate(weekStart.getDate() + 6));
                    const weekData = weatherData.slice(weekIndex, weekIndex + 7);
                    const startDateWeek = weekData[0]?.time || '';
                    const endDateWeek = weekData[weekData.length - 1]?.time || '';

                    return (
                      <div key={weekIndex} className="mb-2">
                        <h3 className="text-lg font-semibold cursor-pointer p-2 bg-gray-200 rounded mb-2" onClick={() => setExpandedDateIndex(expandedDateIndex === weekIndex ? null : weekIndex)}>
                          {startDateWeek} - {endDateWeek}
                        </h3>
                        {expandedDateIndex === weekIndex && (
                          <div className="grid grid-cols-1 gap-1 ">
                            {weekData.map((item, index) => (
                              <div key={index} className="flex flex-col">
                                <div 
                                  className="cursor-pointer bg-blue-200 p-2 rounded-lg mb-1" 
                                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} 
                                >
                                  {item.weekday} - {item.time} {/* Updated to include weekday */}
                                </div>
                                {expandedIndex === index && (
                                  <div className="grid grid-cols-4 gap-4 bg-gray-200 p-2 rounded-lg whitespace-nowrap ">
                                    <span>Max T <FaThermometerHalf /> {item.temperatureMax} °C</span>
                                    <br/>
                                    <span>Sade {item.precipitation} (mm)</span>
                                    <br/>
                                    <span>Min T<FaThermometerHalf /> {item.temperatureMin} °C</span>
                                    <br/>                                    <br/>
                                    <span>Pakkanen {item.frostProbability} (%) </span>
                                  </div>
                                )}
                              </div>
                            ))} 
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-1 text-sm text-gray-600">
                Päivitetty: {updatedAt} | Sijainti: Suomi, {city}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SaaEnnuste;
