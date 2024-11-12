import React, {useContext, useEffect, useState} from 'react';
import '../index.css';
import {UnitContext} from '../context/UnitContext.jsx';

const Metar = () => {
    const {unit} = useContext(UnitContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    };

    const getMetarData = async () => {
        const localUrl = 'http://127.0.0.1:8000/metar/?muoto=html';
        const backupUrl = 'https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=EFHK';

        try {
            const localResponse = await fetchData(localUrl);
            const localData = JSON.parse(localResponse);
            setData(localData);
        } catch (localError) {
            console.error('Local API fetch failed, trying backup API...', localError);
            try {
                const backupResponse = await fetchData(backupUrl);
                const parsedData = parseMetar(backupResponse);
                setData(parsedData);
            } catch (backupError) {
                console.error('Backup API fetch failed', backupError);
                setError('Failed to fetch METAR data from both APIs.');
            }
        }
    };

    useEffect(() => {
        getMetarData();
    }, []);

    const parseMetar = (rawMetar) => {
        const lines = rawMetar.trim().split('\n');
        if (!lines || lines.length < 2) {
            throw new Error('METAR data is not in the expected format');
        }

        const latestMetar = lines[lines.length - 1];
        const parts = latestMetar.split(' ');

        // Time (observation time)
        const timestamp = parts[1];
        const day = parseInt(timestamp.slice(0, 2), 10);
        const hour = parseInt(timestamp.slice(2, 4), 10);
        const minute = parseInt(timestamp.slice(4, 6), 10);
        const observedTime = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), day, hour, minute));
        const observedStr = observedTime.toUTCString();

        let temperature = 'N/A';
        let dewPoint = 'N/A';
        parts.forEach(part => {
            if (part.includes('/')) {
                [temperature, dewPoint] = part.split('/');
            }
        });

        const parseTemperature = (temp) => {
            if (temp.startsWith('M')) {
                return (-parseFloat(temp.slice(1))).toFixed(2);
            }
            return parseFloat(temp).toFixed(2);
        };

        const calculateRelativeHumidity = (temp, dew) => {
            const tempK = temp + 273.15;
            const dewK = dew + 273.15;
            return Math.round(
                100 * (Math.exp((17.625 * dew) / (243.04 + dew)) / Math.exp((17.625 * temp) / (243.04 + temp)))
            );
        };

        const parsedTemperature = temperature !== 'N/A' ? parseTemperature(temperature) : 'N/A';
        const parsedDewPoint = dewPoint !== 'N/A' ? parseTemperature(dewPoint) : 'N/A';
        const humidity = parsedTemperature !== 'N/A' && parsedDewPoint !== 'N/A'
            ? calculateRelativeHumidity(parseFloat(parsedTemperature), parseFloat(parsedDewPoint))
            : 'N/A';

        let barometer = 'N/A';
        parts.forEach(part => {
            if (part.startsWith('Q')) {
                barometer = part.slice(1);
            }
        });

        const windDirection = parts[2] ? parts[2].slice(0, 3) : 'N/A';
        const windSpeedKT = parts[2] ? parseInt(parts[2].slice(3, 5), 10) : 'N/A';
        const windSpeedMs = windSpeedKT !== 'N/A' ? (windSpeedKT * 0.51444).toFixed(1) : 'N/A';

        const visibility = parts[3] || 'N/A';
        const visibilityText = parseInt(visibility, 10) >= 9999 ? '10 km or more' : `${visibility} meters`;

        const cloudCover = [];
        let ceiling = 'N/A';
        parts.forEach(part => {
            if (['FEW', 'SCT', 'BKN', 'OVC'].some(prefix => part.startsWith(prefix))) {
                const cloudAltitude = parseInt(part.slice(3), 10) * 100;
                cloudCover.push(part);
                if (['BKN', 'OVC'].includes(part.slice(0, 3))) {
                    ceiling = cloudAltitude;
                }
            }
        });

        const changeCodes = {
            NOSIG: 'No significant changes expected',
            BECMG: 'Becoming - Conditions are expected to change gradually',
            TEMPO: 'Temporary - Temporary changes expected',
            PROB30: 'Probability 30% - 30% chance of occurrence',
            PROB40: 'Probability 40% - 40% chance of occurrence',
            FM: 'From - Change starting from a specific time',
            TL: 'Until - Change lasting until a specific time',
            AT: 'At - Change occurring at a specific time',
        };

        const changeCode = changeCodes[parts[parts.length - 1]] || 'No significant changes expected';

        return {
            station: {name: parts[0]},
            raw_text: latestMetar,
            temperature: {celsius: parsedTemperature},
            dew_point: {celsius: parsedDewPoint},
            humidity: {percent: humidity},
            wind: {
                direction: windDirection,
                speed_ms: windSpeedMs,
                speed_kt: windSpeedKT,
            },
            visibility: {text: visibilityText},
            barometer: {hpa: barometer},
            ceiling: {feet: ceiling},
            cloud_cover: cloudCover,
            observed: observedStr,
            change_code: changeCode,
            change_description: changeCode,
        };
    };

    const celsiusToFahrenheit = (temp) => (temp * 9 / 5 + 32).toFixed(2);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    const metarParts = data.raw_text.split(' ');
    const yks = metarParts.slice(0, 3).join(' ');
    const kaks = metarParts.slice(3, 6);
    const kol = metarParts.slice(6).join(' ');

    const halki = data.observed.split('');
    const halki1 = halki.slice(0, 8).join('');
    const halki2 = halki.slice(8, 11).join('');
    const halki3 = halki.slice(11).join('');

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <h1 className="text-lg font-bold"><strong>METAR Data for</strong> <br/> {data.station.name}</h1>
            <div>
                <p><strong>Raw METAR: </strong></p>
            </div>
            <div>{yks}</div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {kaks.map((word, index) => (
                    <span key={index} className="flex-1">{word}</span>
                ))}
            </div>
            <p>{kol}</p>
            <div className="space-y-2">
                <p>
                    <strong>Temperature: <br/></strong> {unit === 'metric' ? `${data.temperature.celsius}°C` : `${celsiusToFahrenheit(data.temperature.celsius)}°F`}
                </p>
                <p>
                    <strong>Dew Point: <br/></strong> {unit === 'metric' ? `${data.dew_point.celsius}°C` : `${celsiusToFahrenheit(data.dew_point.celsius)}°F`}
                </p>
                <p><strong>Humidity: <br/></strong> {data.humidity.percent}%</p>
                <p><strong>Wind Speed: <br/></strong> {unit === 'metric' ? `${data.wind.speed_ms} m/s` : `${data.wind.speed_kt} kt`}</p>
                <p><strong>Wind Direction: <br/></strong> {data.wind.direction}°</p>
                <p><strong>Visibility: <br/></strong> {data.visibility.text}</p>
                <p><strong>Clouds:<br/></strong> {data.cloud_cover.length > 0 ? data.cloud_cover.join(', ') : 'N/A'}</p>
                <p><strong>Barometer: <br/></strong> {data.barometer.hpa} hPa</p>
                <p><strong>Ceiling:<br/></strong> {data.ceiling.feet} feet</p>
                <div>
                    <strong>Observed: </strong>
                </div>
                <div>{halki1}</div>
                <div>{halki2}</div>
                <div>{halki3}</div>
                <p><strong>Upcoming changes:<br/></strong> {data.change_description}</p>
            </div>
        </div>
    );
}

export default Metar;

