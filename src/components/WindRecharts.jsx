import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const WindRecharts = () => {
  const [windData, setWindData] = useState([]);
  const [windDirectionData, setWindDirectionData] = useState([]);
  const [lastApiUpdate, setLastApiUpdate] = useState(null);  // API:n päivitysajan hallinta
  const [error, setError] = useState(null);  // Virhetilan hallinta

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

        // Asetetaan tuulen nopeus ja suuntatiedot
        setWindData(data.hourly.wind_speed_10m);
        setWindDirectionData(data.hourly.wind_direction_10m);

        // Asetetaan viimeisin päivitysaika API:sta (ensimmäinen aikaleima hourly.time -taulukosta)
        const apiUpdateTime = data.hourly.time[0];
        setLastApiUpdate(new Date(apiUpdateTime).toLocaleString());

      } catch (error) {
        setError('Error fetching wind data');
        console.error("Error fetching wind data:", error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;  // Näytetään virheilmoitus, jos data ei lataudu
  }

  if (!windData.length || !windDirectionData.length) {
    return <p>Loading wind data...</p>;
  }

  // Data for the line chart
  const lineChartData = windData.map((speed, index) => ({
    time: `${index}:00`,
    speed: speed,
  }));

  // Cardinal directions for the compass
  const compassDirections = [
    { name: 'N', angle: 0 },
    { name: 'E', angle: 90 },
    { name: 'S', angle: 180 },
    { name: 'W', angle: 270 },
  ];

  // Compass degree labels (add degrees every 30°)
  const degreeLabels = [
    { degree: 0, label: '0°' },
    { degree: 30, label: '30°' },
    { degree: 60, label: '60°' },
    { degree: 90, label: '90°' },
    { degree: 120, label: '120°' },
    { degree: 150, label: '150°' },
    { degree: 180, label: '180°' },
    { degree: 210, label: '210°' },
    { degree: 240, label: '240°' },
    { degree: 270, label: '270°' },
    { degree: 300, label: '300°' },
    { degree: 330, label: '330°' },
    { degree: 360, label: '0°/360°' },
  ];

  const currentWindDirection = windDirectionData[0]; // First wind direction
  const rotationAngle = currentWindDirection; // Wind direction in degrees

  return (
    <div className="p-0 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-1 mt-1 ml-2">Wind Speed History</h2>
      <ResponsiveContainer width="95%" height={200} style={{ marginLeft: '-20px' }}>
      <LineChart data={lineChartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="speed" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="font-semibold mb-2 ml-2">Wind Direction</h3>
      <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Outer Compass circle */}
          <circle cx="50%" cy="50%" r="80" stroke="#000" strokeWidth="2" fill="none" />
          
          {/* Inner Compass circle */}
          <circle cx="50%" cy="50%" r="50" stroke="#000" strokeWidth="1" fill="none" />

          {/* Ilman suuntausmerkkien alapuolella olevat valkoset viivat */}
          {compassDirections.map((direction) => (
            <line
              key={direction.name}
              x1="50%"
              y1="50%"
              x2={`${50 + 42 * Math.sin((direction.angle * Math.PI) / 180)}%`}
              y2={`${50 - 42 * Math.cos((direction.angle * Math.PI) / 180)}%`}
              stroke="#ccc"
              strokeWidth="1"
            />
          ))}

          {/* punasen nuolen kontroilointi */}
          <line
            x1="50%"
            y1="50%"
            x2={`${50 + 29 * Math.sin((rotationAngle * Math.PI) / 180)}%`}
            y2={`${50 - 29 * Math.cos((rotationAngle * Math.PI) / 180)}%`}
            stroke="#ff0000"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Arrowhead definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ff0000" />
            </marker>
          </defs>

          {/* N, W, E, S sijainti. Ylempi on sivuttais suunta eli 50 + 46 niin muunnan 46 */}
          {compassDirections.map((dir) => (
            <text
              key={dir.name}
              x={`${50 + 46 * Math.sin((dir.angle * Math.PI) / 180)}%`}
              y={`${50 - 46 * Math.cos((dir.angle * Math.PI) / 180)}%`}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#ff0000"
              dy={dir.name === 'S' ? '0.5em' : '0.3em'} // Adjust vertical position for better visibility
            >
              {dir.name}
            </text>
          ))}

          {/* Asteet ja niiden kontrointi */}
          {degreeLabels.map((degree) => (
            <text
              key={degree.degree}
              x={`${50 + 30 * Math.sin((degree.degree * Math.PI) / 180)}%`}
              y={`${50 - 30 * Math.cos((degree.degree * Math.PI) / 180)}%`}
              textAnchor="middle"
              fontSize="10"
              fill="#000"
            >
              {degree.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Show when the data was last updated */}
      <p className="text-sm text-gray-600 mt-4 ml-2">Last updated from API: {lastApiUpdate}</p>
    </div>
  );
};

export default WindRecharts;
