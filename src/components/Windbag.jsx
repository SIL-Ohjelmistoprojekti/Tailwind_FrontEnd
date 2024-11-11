import React, { useContext, useEffect, useState } from 'react';
import { UnitContext } from '../context/UnitContext.jsx';

const Windbag = () => {
    const { unit } = useContext(UnitContext);
    const [windSpeed, setWindSpeed] = useState(null);
    const [windDirection, setWindDirection] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWindData = async () => {
            try {
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=60.6333&longitude=24.8667&hourly=wind_speed_10m,wind_direction_10m&daily=wind_speed_10m_max&forecast_days=1'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setWindSpeed(data.hourly.wind_speed_10m[0]);
                setWindDirection(data.hourly.wind_direction_10m[0]);
            } catch (error) {
                setError('Error fetching wind data');
                console.error("Error fetching wind data:", error);
            }
        };
        fetchWindData();
    }, []);

    if (error) return <p>{error}</p>;
    if (windSpeed === null || windDirection === null) return <p>Loading wind data...</p>;

    // Convert wind speed based on the unit (metric or knots)
    const speedInCurrentUnit =
        unit === 'metric' ? (windSpeed / 3.6).toFixed(2) : (windSpeed / 1.852).toFixed(2);
    const unitLabel = unit === 'metric' ? 'm/s' : 'kn';

    // Adjust wind bag length based on wind speed
    const windBagLength = Math.min(50 + windSpeed * 2, 120); // Adjust length for clarity

    // Define segments of the wind bag
    const segments = 5;
    const segmentLength = windBagLength / segments;
    const angleRad = ((windDirection - 90) * Math.PI) / 180; // Adjusted angle

    // Center point
    const cx = 160; // Adjusted to move windsock slightly to the right
    const cy = 150;

    // Calculate points for the windsock
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const length = i * segmentLength;
        const width = 20 - i * 3; // Tapering effect
        const centerX = cx + length * Math.cos(angleRad);
        const centerY = cy + length * Math.sin(angleRad);
        const offsetX = (width / 2) * Math.cos(angleRad + Math.PI / 2);
        const offsetY = (width / 2) * Math.sin(angleRad + Math.PI / 2);

        points.push({
            leftX: centerX - offsetX,
            leftY: centerY - offsetY,
            rightX: centerX + offsetX,
            rightY: centerY + offsetY,
        });
    }

    // Compass directions
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

    // Degree labels (every 30 degrees)
    const degreeLabels = [];
    for (let deg = 0; deg < 360; deg += 30) {
        degreeLabels.push(deg);
    }

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h2>Windsock</h2>
            <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto' }}>
                <svg width="100%" height="100%">
                    {/* Outer Circle */}
                    <circle cx={cx} cy={cy} r="100" stroke="#333" strokeWidth="2" fill="none" />

                    {/* Pole */}
                    <line
                        x1={cx}
                        y1={cy}
                        x2={cx - 17 * Math.cos(angleRad)}
                        y2={cy - 17 * Math.sin(angleRad)}
                        stroke="#000"
                        strokeWidth="2"
                    />

                    {/* Wind Bag Segments */}
                    {points.slice(0, -1).map((point, i) => {
                        const nextPoint = points[i + 1];
                        const color = i % 2 === 0 ? 'orange' : 'white';

                        const polygonPoints = `
                            ${point.leftX},${point.leftY}
                            ${point.rightX},${point.rightY}
                            ${nextPoint.rightX},${nextPoint.rightY}
                            ${nextPoint.leftX},${nextPoint.leftY}
                        `;

                        return (
                            <polygon
                                key={i}
                                points={polygonPoints}
                                fill={color}
                                opacity="0.8"
                                stroke="#333"
                                strokeWidth="0.5"
                            />
                        );
                    })}

                    {/* Compass Labels */}
                    {compassDirections.map((direction) => {
                        const angle = ((direction.angle - 90) * Math.PI) / 180;
                        return (
                            <text
                                key={direction.name}
                                x={cx + 110 * Math.cos(angle)}
                                y={cy + 110 * Math.sin(angle)}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill="#000"
                                dy="0.35em"
                            >
                                {direction.name}
                            </text>
                        );
                    })}

                    {/* Degree Labels */}
                    {degreeLabels.map((degree) => {
                        const angle = ((degree - 90) * Math.PI) / 180;
                        return (
                            <text
                                key={degree}
                                x={cx + 90 * Math.cos(angle)}
                                y={cy + 90 * Math.sin(angle)}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#555"
                                dy="0.35em"
                            >
                                {degree}°
                            </text>
                        );
                    })}

                    {/* Wind Direction and Speed Labels */}
                    <text
                        x={cx}
                        y={cy - 40}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#000"
                    >
                        {windDirection}°
                    </text>
                    <text
                        x={cx}
                        y={cy - 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#333"
                    >
                        {speedInCurrentUnit} {unitLabel}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default Windbag;
