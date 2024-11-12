import React, { useContext, useEffect, useState } from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UnitContext } from '../context/UnitContext.jsx';

const WindRecharts = () => {
    const { unit } = useContext(UnitContext);
    const [windData, setWindData] = useState([]);
    const [windDirectionData, setWindDirectionData] = useState([]);
    const [lastApiUpdate, setLastApiUpdate] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=60.6333&longitude=24.8667&hourly=wind_speed_10m,wind_direction_10m&daily=wind_speed_10m_max&forecast_days=1'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setWindData(data.hourly.wind_speed_10m);
                setWindDirectionData(data.hourly.wind_direction_10m);
                const apiUpdateTime = data.hourly.time[0];
                const updateDate = new Date(apiUpdateTime);
                setLastApiUpdate({
                    date: updateDate.toLocaleDateString(),
                    full: updateDate.toLocaleString(),
                });
            } catch (error) {
                setError('Error fetching wind data');
                console.error('Error fetching wind data:', error);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!windData.length || !windDirectionData.length) {
        return <p>Loading wind data...</p>;
    }

    // Conversion functions
    const kphToMs = (speed) => (speed * 0.27778).toFixed(2);
    const kphToKnots = (speed) => (speed / 1.852).toFixed(2);

    // Data for the line chart
    const lineChartData = windData.map((speed, index) => ({
        time: `${index}:00`,
        speed: unit === 'metric' ? kphToMs(speed) : kphToKnots(speed),
    }));

    // Custom tooltip for the line chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid grey',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    <p className="label">{`Time: ${label}`}</p>
                    <p className="intro">{`Wind Speed: ${payload[0].value} ${
                        unit === 'metric' ? 'm/s' : 'kt'
                    }`}</p>
                </div>
            );
        }

        return null;
    };

    // Cardinal directions for the compass
    const compassDirections = [
        { name: 'N', angle: 0 },
        { name: 'NE', angle: 45 },
        { name: 'E', angle: 90 },
        { name: 'SE', angle: 135 },
        { name: 'S', angle: 180 },
        { name: 'SW', angle: 225 },
        { name: 'W', angle: 270 },
        { name: 'NW', angle: 315 },
    ];

    // Degree labels every 30°
    const degreeLabels = Array.from({ length: 12 }, (_, i) => {
        const degree = i * 30;
        return { degree, label: `${degree}°` };
    });

    const currentWindDirection = windDirectionData[0]; // First wind direction
    const rotationAngle = currentWindDirection; // Wind direction in degrees

    return (
        <div className="p-0 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-1 ml-2">
                Wind Speed {lastApiUpdate?.date}, Riihimäki{' '}
            </h2>
            <ResponsiveContainer width="95%" height={200} style={{ marginLeft: '-20px' }}>
                <LineChart data={lineChartData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="speed" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
            <h3 className="font-semibold mb-2 ml-2">Current Wind Direction</h3>
            <div
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '300px',
                    margin: '0 auto',
                }}
            >
                <svg
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    viewBox="0 0 300 300"
                >
                    {/* Outer circle */}
                    <circle cx="150" cy="150" r="100" stroke="#000" strokeWidth="2" fill="none" />

                    {/* Inner circle */}
                    <circle cx="150" cy="150" r="70" stroke="#000" strokeWidth="1" fill="none" />

                    {/* Compass lines */}
                    {compassDirections.map((direction) => (
                        <line
                            key={direction.name}
                            x1="150"
                            y1="150"
                            x2={150 + 100 * Math.sin((direction.angle * Math.PI) / 180)}
                            y2={150 - 100 * Math.cos((direction.angle * Math.PI) / 180)}
                            stroke="#ccc"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Red arrow starting at the outer edge pointing towards the center */}
                    <line
                        x1={150 + 100 * Math.sin((rotationAngle * Math.PI) / 180)}
                        y1={150 - 100 * Math.cos((rotationAngle * Math.PI) / 180)}
                        x2="150"
                        y2="150"
                        stroke="#ff0000"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Wind direction text at the arrow's tail */}
                    <text
                        x={150 + 110 * Math.sin((rotationAngle * Math.PI) / 180)}
                        y={150 - 80 * Math.cos((rotationAngle * Math.PI) / 180)}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#000"
                        dy="0.3em"
                    >
                        {rotationAngle}°
                    </text>

                    {/* Arrowhead definition */}
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="10"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ff0000" />
                        </marker>
                    </defs>

                    {/* Compass labels (N, NE, E, etc.) */}
                    {compassDirections.map((dir) => (
                        <text
                            key={dir.name}
                            x={150 + 120 * Math.sin((dir.angle * Math.PI) / 180)}
                            y={150 - 120 * Math.cos((dir.angle * Math.PI) / 180)}
                            textAnchor="middle"
                            fontSize="16"
                            fontWeight="bold"
                            fill="#ff0000"
                            dy="0.3em"
                        >
                            {dir.name}
                        </text>
                    ))}

                    {/* Degree labels */}
                    {degreeLabels.map((degree) => (
                        <text
                            key={degree.degree}
                            x={150 + 110 * Math.sin((degree.degree * Math.PI) / 180)}
                            y={150 - 110 * Math.cos((degree.degree * Math.PI) / 180)}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#000"
                            dy="0.3em"
                        >
                            {degree.label}
                        </text>
                    ))}
                </svg>
            </div>
            {/* Show when the data was last updated */}
            <p className="text-sm text-gray-600 mt-4 ml-2">
                Wind charts last updated: {lastApiUpdate?.full}
            </p>
        </div>
    );
};

export default WindRecharts;
