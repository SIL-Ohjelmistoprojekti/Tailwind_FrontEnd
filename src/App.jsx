import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WeatherForecast from "./components/WeatherForecast.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import Kiito from './components/Runway.jsx';
import Metar from './components/Metar.jsx';
import Admin from './admin/admin.jsx';
import Login from './admin/Login.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import CurrentNews from './admin/CurrentNew.jsx';
import Register from './admin/Register.jsx';
import WindRecharts from './components/WindRecharts.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import {UnitProvider} from './context/UnitContext.jsx';
import CookieConsent from './components/CookieConsent.jsx';

const App = () => {
    return (
        <UnitProvider>
            <Router>
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="flex flex-col md:flex-row justify-start items-start w-full">
                                    {/* Vasemman laidan kolumni */}
                                    <div className="w-full md:w-1/6 md:mr-3 mb-4 md:mb-0">
                                        <div id="current-news" className="mb-2">
                                            <CurrentNews />
                                        </div>
                                        <div className="text-center">
                                            <UnitToggle />
                                        </div>
                                        <div id="current-weather">
                                            <CurrentWeather />
                                        </div>
                                    </div>
                                    <div id="runways" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6">
                                        <Kiito />
                                    </div>

                                    <div id="metar" className="mb-2 md:mb-0 md:ml-10 w-full md:w-1/6">
                                        <Metar />
                                    </div>

                                    <div id="forecast" className="w-full md:flex-grow">
                                        <WindRecharts />
                                        <WeatherForecast />
                                    </div>
                                </div>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <CookieConsent />
                </div>
            </Router>
        </UnitProvider>
    );
};

export default App;
