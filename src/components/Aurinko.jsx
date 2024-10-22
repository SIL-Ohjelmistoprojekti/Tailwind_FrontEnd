import * as React from 'react';
import {createRoot} from 'react-dom/client'; // Update this import

// Coordinates for Helsinki, Oulu, and Utsjoki
const cities = [
  { name: 'Helsinki', latitude: 60.1695, longitude: 24.9354 },
  { name: 'Oulu', latitude: 65.0121, longitude: 25.4717 },
  { name: 'Utsjoki', latitude: 69.9076, longitude: 27.0252 },
];

// Create a function to fetch sunrise and sunset times
const fetchSunriseSunset = async (latitude, longitude) => {
  const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
  const data = await response.json();
  return {
    sunrise: new Date(data.results.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.results.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const Aurinko = () => {
  const [sunriseSunsetData, setSunriseSunsetData] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        cities.map(city => fetchSunriseSunset(city.latitude, city.longitude))
      );
      const data = {};
      cities.forEach((city, index) => {
        data[city.name] = results[index];
      });
      setSunriseSunsetData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {cities.map(city => (
        <div key={city.name}>
            <div className='whitespace-nowrap text-center'>
          {city.name} {sunriseSunsetData[city.name]?.sunrise} - {sunriseSunsetData[city.name]?.sunset}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export the component
export default Aurinko;

// Render the component
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root
root.render(<Aurinko />); // Use the new render method
