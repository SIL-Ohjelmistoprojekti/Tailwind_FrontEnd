import React, {useContext, useEffect, useState} from 'react';
import {UnitContext} from '../context/UnitContext.jsx';
import Aurinko from './Aurinko';

const Current = () => {
    const {unit} = useContext(UnitContext);
    const [currentWeather, setCurrentWeather] = useState({});
    const [measuredTime, setMeasuredTime] = useState(new Date());

    function runEverySecond() {
        console.log("Running code every second!");
        setMeasuredTime(new Date());
    }

    useEffect(() => {
        runEverySecond();
        const interval = setInterval(runEverySecond, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchWeather = async () => {
        try {
            const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=hyvink%C3%A4%C3%A4&APPID=13a49403ab1ec48764e253d6a47e110f");
            const data = await response.json();

            setCurrentWeather(data);
            console.log("Weather data fetched", data);
        } catch (err) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchWeather();
        const weatherInterval = setInterval(fetchWeather, 60000);

        return () => clearInterval(weatherInterval);
    }, []);

    // Jos data ei ole vielä ladattu, näytetään "Ladataan..." viesti
    if (!currentWeather.main || !currentWeather.wind || !currentWeather.clouds) {
        return <div>Ladataan säätietoja...</div>;
    }

    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);
    const kelvinToFahrenheit = (temp) => (temp * 9 / 5 - 459.67).toFixed(2);
    const windspeedToKmh = (speed) => (speed * 3.6).toFixed(2);
    const windspeedToMph = (speed) => (speed * 2.237).toFixed(2);

    const formatTime = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}.${month}. ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div id="current" className="container mx-auto p-3 bg-gray-100 rounded-lg shadow-lg max-w-sm text-left">
            <h2 className="text-2xl font-bold mb-1 whitespace-nowrap text-center">Weather Now</h2>
            <p className="text-lg mb-1 text-left">{formatTime(measuredTime)}</p>
            <div className="flex flex-col gap-4 text-left">
                <div>
                    <p id="temperature" className="p-1 bg-blue-200 rounded-lg text-left mb-1">
                        <strong>Temperature:</strong> <br/> {unit === 'metric' ? kelvinToCelsius(currentWeather.main.temp) : kelvinToFahrenheit(currentWeather.main.temp)} °{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p id="humidity" className="p-1 bg-blue-200 rounded-lg text-left mb-1">
                        <strong>Humidity:</strong> <br/> {currentWeather.main.humidity} %
                    </p>
                    <p id="pressure" className="p-1 bg-blue-200 rounded-lg text-left whitespace-nowrap">
                        <strong>Barometric Pressure:</strong> <br/> {currentWeather.main.pressure} hPa
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1 text-left">Wind</h3>
                    <p id="average_wind_speed" className="p-1 bg-blue-100 rounded-lg text-left mb-1 whitespace-nowrap">
                        <strong>Average Wind
                            Speed:</strong>  <div>{unit === 'metric' ? windspeedToKmh(currentWeather.wind.speed) : windspeedToMph(currentWeather.wind.speed)} {unit === 'metric' ? 'km/h' : 'mph'}
                            </div>
                    </p>
                    <p id="max_wind_speed" className="p-1 bg-blue-100 rounded-lg text-left mb-1">
                        <strong>Wind
                            Gust:</strong> <br/>{currentWeather.wind.gust ? (unit === 'metric' ? windspeedToKmh(currentWeather.wind.gust) : windspeedToMph(currentWeather.wind.gust)) : 'No data'} {unit === 'metric' ? 'km/h' : 'mph'}
                    </p>
                    <p id="wind_direction" className="p-1 bg-blue-100 rounded-lg text-left">
                        <strong>Wind Direction:</strong> <br/> {currentWeather.wind.deg} °
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1 text-left">Cloudiness</h3>
                    <p id="clouds" className="p-1 bg-blue-100 rounded-lg text-left">
                        <strong>Cloudiness:</strong> <br/>{currentWeather.clouds.all} %
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-left">Aurinko</h3>
                <div className=" font-semibold mb-2 text-left p-1 bg-blue-100 rounded-lg">
                    <Aurinko/>
                </div>
            </div>
        </div>);
};

export default Current;

