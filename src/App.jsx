import React from 'react';
import Navbar from './components/Navbar';
import SaaEnnuste from './components/SaaEnnuste';
import Current from './components/Current';
import Kiito from './components/Kiito';
import Metar from './components/metar';
const App = () => {
  return (
    <div className="flex flex-col md:flex-row justify-start items-start w-full">
      <Navbar />
      
      <div id="current-weather" className="mb-4 md:mb-0 md:mr-3 w-full md:w-1/6"> 
        <Current />
      </div>

      <div id="runways" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6"> 
        <Kiito />
      </div>
      <div id="runways" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6"> 
        <Metar />
      </div>

      <div id="forecast" className="w-full md:flex-grow"> 
        <SaaEnnuste />
      </div>
      
    </div>
  );
};

export default App;
