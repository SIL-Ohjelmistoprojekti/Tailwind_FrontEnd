import React from 'react';
import SaaEnnuste from './components/SaaEnnuste'; // Tuodaan uusi komponentti
import Current from './components/Current';
import Kiito from './components/Kiito';

const App = () => {
  return (
    <div className="flex flex-col md:flex-row justify-start items-start w-full">
      {/* Current-komponentti, täysleveä mobiilissa ja kiinteä leveys suuremmilla näytöillä */}
      <div className="mb-4 md:mb-0 md:mr-3 w-full md:w-1/6"> 
        <Current />
      </div>

      {/* Kiito-komponentti, myös kiinteä leveys suuremmilla näytöillä */}
      <div className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6"> 
        <Kiito />
      </div>

     
      {/* SaaEnnuste-komponentti, kasvaa ja vie kaiken ylimääräisen tilan */}
      <div className="w-full md:flex-grow "> 
        <SaaEnnuste />
      </div>
    </div>
  );
};

export default App;
