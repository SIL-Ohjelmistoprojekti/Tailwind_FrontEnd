import React, { useContext, useEffect, useState } from 'react';
import { UnitContext } from '../context/UnitContext.jsx';
import SunStatus from './SunStatus.jsx';

const CurrentWeather = () => {
    const { unit } = useContext(UnitContext);
    const [currentWeather, setCurrentWeather] = useState({});
    const [measuredTime, setMeasuredTime] = useState(new Date());

    function runEverySecond() {
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
        } catch (err) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchWeather();
        const weatherInterval = setInterval(fetchWeather, 60000);
        return () => clearInterval(weatherInterval);
    }, []);

    if (!currentWeather.main || !currentWeather.wind || !currentWeather.clouds) {
        return <div>Ladataan säätietoja...</div>;
    }

    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);
    const kelvinToFahrenheit = (temp) => (temp * 9 / 5 - 459.67).toFixed(2);
    const windspeedToKnots = (speed) => (speed * 1.94384).toFixed(1);
    const formatTime = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}.${month}. ${hours}:${minutes}:${seconds}`;
    };

    const weatherIconCode = currentWeather.weather && currentWeather.weather[0]?.icon;
    const weatherDescription = currentWeather.weather && currentWeather.weather[0]?.description;
    
    const getCustomIcon = (iconCode) => {
        const iconMap = {
            "01d": "/images/weather-icons/sun.png",
            "01n": "/images/weather-icons/moon.png",
            "02d": "/images/weather-icons/cloudy-sun.png",
            "02n": "/images/weather-icons/cloudy-night.png",
            "03d": "/images/weather-icons/cloud.png",
            "03n": "/images/weather-icons/cloud.png",
            "04d": "/images/weather-icons/broken-clouds.png", 
            "04n": "/images/weather-icons/broken-clouds.png",  
            "09d": "/images/weather-icons/heavy-rain.png",
            "09n": "/images/weather-icons/heavy-rain.png",
            "10d": "/images/weather-icons/rain-day.png",
            "10n": "/images/weather-icons/rain-night.png",
            "11d": "/images/weather-icons/thunder.png",
            "11n": "/images/weather-icons/thunder.png",
            "13d": "/images/weather-icons/snow.png",
            "13n": "/images/weather-icons/snow.png",
            "50d": "/images/weather-icons/mist.png",
            "50n": "/images/weather-icons/mist.png",
        };
    
        return iconMap[iconCode] || "/images/weather-icons/default.png"; // Fallback icon
    };
        

    const weatherIconUrl = getCustomIcon(weatherIconCode);

    return (
        <div id="current" className="container mx-auto p-3 bg-gray-100 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-1 whitespace-nowrap text-center">Weather Now</h2>
            <p className="text-lg mb-1">{formatTime(measuredTime)}</p>

            {weatherIconCode && (
                <div
                    className="flex items-center justify-center mb-1"
                    style={{ height: "120px" }}
                >
                    <img
                        src={weatherIconUrl}
                        alt={weatherDescription}
                        style={{
                            width: "100px",
                            height: "100px",
                        }}
                    />
                </div>
            )}

            <div className="flex flex-col gap-4 text-left">
                <div>
                    <p id="temperature" className="p-1 bg-blue-200 rounded-lg mb-1">
                        <strong>Temperature:</strong>
                        <br /> {unit === 'metric' ? kelvinToCelsius(currentWeather.main.temp) : kelvinToFahrenheit(currentWeather.main.temp)} °{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p id="humidity" className="p-1 bg-blue-200 rounded-lg mb-1">
                        <strong>Humidity:</strong> <br /> {currentWeather.main.humidity} %
                    </p>
                    <p id="pressure" className="p-1 bg-blue-200 rounded-lg">
                        <strong>Barometric Pressure:</strong> <br /> {currentWeather.main.pressure} hPa
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1">Wind</h3>
                    <p id="average_wind_speed" className="p-1 bg-blue-100 rounded-lg mb-1">
                        <strong>Average Wind Speed:</strong> <br />
                        {unit === 'metric' ? `${currentWeather.wind.speed.toFixed(1)} m/s` : `${windspeedToKnots(currentWeather.wind.speed)} kt`}
                    </p>
                    <p id="max_wind_speed" className="p-1 bg-blue-100 rounded-lg mb-1">
                        <strong>Wind Gust:</strong> <br />
                        {unit === 'metric' ? `${currentWeather.wind.gust.toFixed(1)} m/s` : `${windspeedToKnots(currentWeather.wind.gust)} kt`}
                    </p>
                    <p id="wind_direction" className="p-1 bg-blue-100 rounded-lg">
                        <strong>Wind Direction:</strong> <br /> {currentWeather.wind.deg} °
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1">Cloudiness</h3>
                    <p id="clouds" className="p-1 bg-blue-100 rounded-lg">
                        <strong>Cloudiness:</strong> <br />{currentWeather.clouds.all} %
                    </p>
                </div>

                <h3 className="text-xl font-semibold">Sun</h3>
                <div className="font-semibold mb-2 p-1 bg-blue-100 rounded-lg">
                    <SunStatus />
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
