import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SaaEnnuste from './components/SaaEnnuste.jsx';
import Current from './components/Current.jsx';
import Kiito from './components/Kiito.jsx';
import Metar from './components/Metar.jsx';
import Admin from './admin/admin.jsx';
import Login from './admin/Login.jsx'; 
import NotFound from './components/NotFound/NotFound.jsx';
import CurrentNews from './admin/CurrentNew.jsx'; 
import Register from './Admin/Register.jsx'; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col md:flex-row justify-start items-start w-full">
              {/* Vasemman laidan kolumni */}
              <div className="w-full md:w-1/6 md:mr-3 mb-4 md:mb-0">
                <div id="current-news" className="mb-4">
                  <CurrentNews />
                </div>
                <div id="current-weather">
                  <Current />
                </div>
              </div>
              <div id="runways" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6">
                <Kiito />
              </div>

              <div id="metar" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6">
                <Metar />
              </div>

              <div id="forecast" className="w-full md:flex-grow">
                <SaaEnnuste />
              </div>

              
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
