import React, { useEffect, useState } from "react";
import Aurinko from "./Aurinko";

const Current = () => {
  const [currentWeather, setCurrentWeather] = useState([]);
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
      const response = await fetch(
        "http://127.0.0.1:8000/weather/?muoto=json"
      );
      const data = await response.json();

      setCurrentWeather(data);
      console.log(currentWeather.one_hour_rainfall);
      console.log("Running code every minute");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 60000);

    return () => clearInterval(weatherInterval);
  }, []);

  const {
    temperature,
    humidity,
    barometric_pressure,
    one_hour_rainfall,
    twenty_four_hour_rainfall,
    average_wind_speed,
    max_wind_speed,
    wind_direction,
  } = currentWeather;

  const formatTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}.${month}. ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div id="current" className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg max-w-sm text-left">
      <h2 className="text-2xl font-bold mb-1 whitespace-nowrap text-center">Weather Now</h2>
      <p className="text-lg mb-1 text-left">{formatTime(measuredTime)}</p>
      <div className="flex flex-col gap-4 text-left">
        <div>
          <p id="temperature" className="p-2 bg-blue-200 rounded-lg text-left mb-1">
            <strong>Temperature:</strong> {temperature || "No data"} °C
          </p>
          <p id="humidity" className="p-2 bg-blue-200 rounded-lg text-left mb-1">
            <strong>Humidity:</strong> {humidity || "No data"} %
          </p>
          <p id="pressure" className="p-2 bg-blue-200 rounded-lg text-left whitespace-nowrap">
            <strong>Barometric Pressure:</strong> <br/> {barometric_pressure || "No data"} hPa
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-1 text-left ">Wind</h3>
          <p id="average_wind_speed" className="p-2 bg-blue-100 rounded-lg text-left mb-1">
            <strong>Average Wind Speed:</strong> {average_wind_speed || "No data"} m/s
          </p>
          <p id="max_wind_speed" className="p-2 bg-blue-100 rounded-lg text-left mb-1">
            <strong>Max Wind Speed:</strong> {max_wind_speed || "No data"} m/s
          </p>
          <p id="wind_direction" className="p-2 bg-blue-100 rounded-lg text-left">
            <strong>Wind Direction:</strong> {wind_direction || "No data"} °
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-1 text-left">Rain</h3>
          <p id="one_hour_rainfall" className="p-2 bg-blue-100 rounded-lg text-left mb-1">
            <strong>One Hour Rainfall:</strong> {one_hour_rainfall || "No data"} mm
          </p>
          <p id="twenty_four_hour_rainfall" className="p-2 bg-blue-100 rounded-lg text-left">
            <strong>24 Hour Rainfall:</strong> {twenty_four_hour_rainfall || "No data"} mm
          </p>
        </div>
        <h3 className="text-xl font-semibold text-left">Aurinko</h3>

        <div className=" font-semibold mb-2 text-left p-2 bg-blue-100 rounded-lg">
          <Aurinko />
        </div>
      </div>
    </div>
  );
};

export default Current;
