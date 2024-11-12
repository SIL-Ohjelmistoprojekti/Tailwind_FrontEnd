import React, {useContext, useEffect, useRef, useState} from 'react';
import {FaInfoCircle, FaThermometerHalf, FaTimes} from 'react-icons/fa';
import '../index.css';
import {UnitContext} from '../context/UnitContext.jsx';


const WeatherForecast = () => {
    // Tilamuuttujat säilyttävät säädataa ja komponentin tilaa
    const {unit} = useContext(UnitContext);
    const [weatherData, setWeatherData] = useState([]); // Säilyttää haetun säädatan
    const [loading, setLoading] = useState(true); // Indikoi lataustilaa
    const [updatedAt, setUpdatedAt] = useState(''); // Viimeksi päivitetty aika datalle
    const [city, setCity] = useState(''); // Kaupungin nimi, jolle data on haettu
    const [infoVisible, setInfoVisible] = useState({}); // Seuraa tietopoppien näkyvyyttä
    const [deviceType, setDeviceType] = useState('desktop'); // Havaitsee laitteen tyypin (desktop, tablet, mobile)
    const [expandedIndex, setExpandedIndex] = useState(null); // Hallitsee, mikä item on avattu
    const [expandedDateIndex, setExpandedDateIndex] = useState(null); // Hallitsee, mikä päivämääräjoukko on avattu
    const infoRef = useRef(null); // Ref ulkopuolisten klikkausten käsittelyä varten tietopop-upissa
    const [windData, setWindData] = useState([]); // Säilyttää tuulen tiedot


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
                    headers: {},
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
                setUpdatedAt(updatedTime.toLocaleString('fi-FI', {timeZone: 'Europe/Helsinki'}));

                setCity('Hyvinkää');

                const extractedData = jsonData.properties.timeseries.slice(0, 14).map((item) => {
                    const time = item.time;
                    const details = item.data.next_24_hours.details;

                    // Get the weekday from the date
                    const weekday = new Date(time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        timeZone: 'Europe/Helsinki'
                    });
                    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1); // Capitalize first letter

                    return {
                        weekday: capitalizedWeekday, // Use capitalized weekday
                        time: new Date(time).toLocaleDateString('fi-FI', {timeZone: 'Europe/Helsinki'}),
                        temperatureMax: details.air_temperature_max !== undefined ? details.air_temperature_max : 'Ei dataa',
                        temperatureMin: details.air_temperature_min !== undefined ? details.air_temperature_min : 'Ei dataa',
                        precipitation: details.precipitation_amount !== undefined ? details.precipitation_amount : 'Ei dataa',
                        frostProbability: details.probability_of_frost !== undefined ? details.probability_of_frost : 'Ei dataa',
                    };
                });

                console.log('Extracted Data:', extractedData);
                setWeatherData(extractedData);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('Fetch aborted due to timeout');
                } else {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        // Tuulidatan haku Tuuli.jsx-komponentin sisällön perusteella
        const fetchWindData = async () => {
            const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=60.6333&longitude=24.8667&hourly=wind_speed_10m,wind_direction_10m&daily=wind_speed_10m_max&forecast_days=14';

            try {
                const response = await fetch(apiUrl);
                const jsonData = await response.json();

                if (!jsonData || !jsonData.hourly || !jsonData.daily) {
                    console.error('Wind data structure is not as expected:', jsonData);
                    return;
                }

                const windSpeed = jsonData.daily.wind_speed_10m_max;
                const windDirection = jsonData.hourly.wind_direction_10m.slice(0, 14);

                const extractedWindData = windSpeed.map((speed, index) => ({
                    windSpeed: speed,
                    windDirection: windDirection[index],
                }));

                setWindData(extractedWindData);
            } catch (error) {
                console.error('Error fetching wind data:', error);
            }
        };

        fetchWindData();
    }, []);

    const info = {
        mobiili: "Viikkoja painamalla saat lisätietoa tulevista sääennusteista",
    };
    const otsikko = {
        weekday: "Weekday",
        date: "Date",
        maxTemp: "Max. T",
        minTemp: "Min. T",
        precipitation: "Rain(mm)",
        windSpeed: "Wind Speed (km/h)",
        windDirection: "Wind Direction (°)"
    };

    const infoTexts = {
        weekday: "Date",
        date: "This date means predictable weather. The information available is subject to change.",
        maxTemp: "Predicting the estimated maximum temperature",
        minTemp: "Minimum temperature",
        precipitation: "Amount of rain in millimetres",
        frostProbability: "Chance of frost as a percentage",
        windSpeed: " Max Wind speed ",
        windDirection: "Wind direction"
    };

    const handleMouseEnter = (key) => {
        setInfoVisible((prev) => ({...prev, [key]: true}));
    };

    const handleMouseLeave = (key) => {
        setInfoVisible((prev) => ({...prev, [key]: false}));
    };

    const startDate = weatherData.length > 0 ? weatherData[0].time : '';
    const endDate = weatherData.length > 0 ? weatherData[weatherData.length - 1].time : '';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoVisible['mobiili'] && infoRef.current && !infoRef.current.contains(event.target)) {
                setInfoVisible((prev) => ({...prev, mobiili: false}));
            }
        };

        if (infoVisible['mobiili']) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [infoVisible]);

    const convertTemperature = (temp, unit) => {
        if (unit === 'imperial') {
            return ((temp * 9 / 5) + 32).toFixed(2);
        }
        return temp;
    };

    const convertWindSpeed = (speed, unit) => {
        if (unit === 'imperial') {
            // Convert to knots
            return (speed * 0.539957).toFixed(1);
        }
        // Convert to meters per second
        return (speed / 3.6).toFixed(1);
    };


    return (
        <div className="container mx-auto flex justify-end">
            {loading ? (
                <p className="text-lg">Ladataan dataa...</p>
            ) : (
                <div className={`w-full sm:w-3/4 md:w-2/4 lg:w-[100%] bg-gray-100 p-4 rounded-lg shadow-lg`}>
                    {weatherData.length === 0 ? (
                        <p className="text-lg">Ei säädataa saatavilla.</p>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold mb-1">
                                14-Day Weather Forecast <br/>{startDate} - {endDate}
                                {deviceType === 'mobile' && (
                                    <span className="inline-block relative group ml-2">
                                    <FaInfoCircle
                                        className="inline-block text-blue-500 cursor-pointer"
                                        onClick={() => setInfoVisible((prev) => ({...prev, mobiili: !prev.mobiili}))}
                                    />
                                        {infoVisible['mobiili'] && (
                                            <div
                                                ref={infoRef}
                                                className={`absolute left-1/2 transform -translate-x-[calc(50%+20px)] mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10`}
                                            >
                                                <p>{info['mobiili']}</p>
                                                <FaTimes
                                                    className="absolute top-1 right-1 text-red-500 cursor-pointer"
                                                    onClick={() => setInfoVisible((prev) => ({
                                                        ...prev,
                                                        mobiili: false
                                                    }))}
                                                />
                                            </div>
                                        )}
                                </span>
                                )}
                            </h2>

                            {deviceType === 'desktop' ? (
                                <div>
                                    <div className="grid grid-cols-7 gap-3 font-bold text-center">
                                        <div className="relative group">
                                            <span>{otsikko.weekday}</span>
                                            <br/>
                                            <FaInfoCircle
                                                className="inline-block ml-1 text-blue-500 cursor-pointer"
                                                onMouseEnter={() => handleMouseEnter('weekday')}
                                                onMouseLeave={() => handleMouseLeave('weekday')}
                                            />
                                            {infoVisible['weekday'] && (
                                                <div
                                                    className="absolute left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                    {infoTexts['weekday']}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <span>{otsikko.date}</span>
                                            <br/>
                                            <FaInfoCircle
                                                className="inline-block ml-1 text-blue-500 cursor-pointer"
                                                onMouseEnter={() => handleMouseEnter('date')}
                                                onMouseLeave={() => handleMouseLeave('date')}
                                            />
                                            {infoVisible['date'] && (
                                                <div
                                                    className="absolute left-0 mt-1 bg-white border border-gray-300 p-1 rounded shadow-lg z-10">
                                                    {infoTexts['date']}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-center">Temperature:</div>
                                            <div className="grid grid-cols-2">
                                                <div className="relative group ">
                                                    <span>Max</span>
                                                    <br/>
                                                    <FaInfoCircle
                                                        className="inline-block ml-1 text-blue-500 cursor-pointer mb-1"
                                                        onMouseEnter={() => handleMouseEnter('maxTemp')}
                                                        onMouseLeave={() => handleMouseLeave('maxTemp')}
                                                    />
                                                    {infoVisible['maxTemp'] && (
                                                        <div
                                                            className="absolute left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                            {infoTexts['maxTemp']}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative group ">
                                                    <span>Min</span>
                                                    <br/>
                                                    <FaInfoCircle
                                                        className="inline-block ml-1 text-blue-500 cursor-pointer mb-1"
                                                        onMouseEnter={() => handleMouseEnter('minTemp')}
                                                        onMouseLeave={() => handleMouseLeave('minTemp')}
                                                    />
                                                    {infoVisible['minTemp'] && (
                                                        <div
                                                            className="absolute right-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                            {infoTexts['minTemp']}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <span>{otsikko.precipitation}</span>
                                            <br/>
                                            <FaInfoCircle
                                                className="inline-block ml-1 text-blue-500 cursor-pointer mb-1"
                                                onMouseEnter={() => handleMouseEnter('precipitation')}
                                                onMouseLeave={() => handleMouseLeave('precipitation')}
                                            />
                                            {infoVisible['precipitation'] && (
                                                <div
                                                    className="absolute left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                    {infoTexts['precipitation']}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-center">Wind:</div>
                                            <div className="grid grid-cols-2">
                                                <div className="relative group ">
                                                    <span>Speed</span>
                                                    <br/>
                                                    <FaInfoCircle
                                                        className="inline-block ml-1 text-blue-500 cursor-pointer mb-1"
                                                        onMouseEnter={() => handleMouseEnter('windSpeed')}
                                                        onMouseLeave={() => handleMouseLeave('windSpeed')}
                                                    />
                                                    {infoVisible['windSpeed'] && (
                                                        <div
                                                            className="absolute left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                            {infoTexts['windSpeed']}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative group mb-1 ">
                                                    <span>Direction</span>
                                                    <br/>
                                                    <FaInfoCircle
                                                        className="inline-block ml-1 text-blue-500 cursor-pointer"
                                                        onMouseEnter={() => handleMouseEnter('windDirection')}
                                                        onMouseLeave={() => handleMouseLeave('windDirection')}
                                                    />
                                                    {infoVisible['windDirection'] && (
                                                        <div
                                                            className="absolute right-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                                                            {infoTexts['windDirection']}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {weatherData.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <span
                                                    className="font-bold text-xs p-1 bg-gray-200 rounded">{item.weekday}</span>
                                                <span
                                                    className="font-bold text-xs p-1 bg-gray-200 rounded">{item.time}</span>
                                                <span className="font-bold text-xs text-center p-0 bg-gray-200 rounded">
                                                {convertTemperature(item.temperatureMax, unit)} °{unit === 'metric' ? 'C' : 'F'}
                                            </span>
                                                <span className="font-bold text-xs text-center p-0 bg-gray-200 rounded">
                                                {convertTemperature(item.temperatureMin, unit)} °{unit === 'metric' ? 'C' : 'F'}
                                            </span>
                                                <span
                                                    className="font-bold text-xs text-center p-0 bg-gray-200 rounded">{item.precipitation} mm</span>
                                                <span className="font-bold text-xs text-center p-0 bg-gray-200 rounded">
    {convertWindSpeed(windData[index]?.windSpeed, unit) || 'Ei dataa'} {unit === 'metric' ? 'm/s' : 'kn'}
</span>

                                                <span className="font-bold text-xs text-center p-0 bg-gray-200 rounded">
                                                {windData[index]?.windDirection || 'Ei dataa'}°
                                            </span>
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
                                                <h3 className="text-lg font-semibold cursor-pointer p-2 bg-gray-200 rounded mb-2"
                                                    onClick={() => setExpandedDateIndex(expandedDateIndex === weekIndex ? null : weekIndex)}>
                                                    {startDateWeek} - {endDateWeek}
                                                </h3>
                                                {expandedDateIndex === weekIndex && (
                                                    <div className="grid grid-cols-1 gap-1 ">
                                                        {weekData.map((item, index) => (
                                                            <div key={index} className="flex flex-col">
                                                                <div
                                                                    className="cursor-pointer bg-blue-200 p- rounded-lg mb-1"
                                                                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                                                >
                                                                    {item.weekday} - {item.time}
                                                                </div>
                                                                {expandedIndex === index && (
                                                                    <div
                                                                        className="grid grid-cols-1 gap-2 bg-gray-200 p-2 rounded-lg whitespace-nowrap">
                                                                        <span
                                                                            className="inline-flex items-center whitespace-nowrap font-bold text-xs text-center p-0 bg-gray-200 rounded">Max T: {item.temperatureMax} °C <FaThermometerHalf/></span>
                                                                        <span
                                                                            className="inline-flex items-center whitespace-nowrap font-bold text-xs text-center p-0 bg-gray-200 rounded">Min T: {item.temperatureMin} °C <FaThermometerHalf/></span>
                                                                        <span
                                                                            className="inline-flex items-center whitespace-nowrap font-bold text-xs text-center p-0 bg-gray-200 rounded">Rain: {item.precipitation} mm</span>
                                                                        <span
                                                                            className="inline-flex items-center whitespace-nowrap font-bold text-xs text-center p-0 bg-gray-200 rounded">Wind Speed: {windData[index]?.windSpeed || 'Ei dataa'} km/h</span>
                                                                        <span
                                                                            className="inline-flex items-center whitespace-nowrap font-bold text-xs text-center p-0 bg-gray-200 rounded">Wind Direction: {windData[index]?.windDirection || 'Ei dataa'}°</span>
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
                                Updated: {updatedAt} | Location: Finland, {city}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WeatherForecast;