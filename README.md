# Tailwind FrontEnd Documentation

Welcome to the ```Tailwind_FrontEnd``` project documentation! This frontend is designed for displaying real-time and forecasted weather data, utilizing React.js and Tailwind CSS for building a responsive, clean, and intuitive user interface. It provides seamless integration with back-end APIs to deliver meteorological insights for airplanes and airports, contributing to safe and efficient aviation operations.

## Table of Contents

+ Overview
+ Features
+ Prerequisites
+ Installation
+ Available Components
+ Aurinko
+ Current
+ Kiilto
+ Metar
+ SaaEnnuste
+ UnitToggle
+ WindRecharts
+ Usage
+ Contributing
+ License

## Overview

The ```Tailwind_FrontEnd``` project offers a responsive, real-time weather dashboard aimed at aviation professionals. The app uses the Tailwind CSS framework to ensure an optimized user interface across all devices. This project provides components that visualize weather data, forecasts, and METAR information.

It integrates with back-end weather data services to support airport and flight safety, offering easy-to-read weather details like temperature, wind speed, and aviation-specific forecasts.

## Features

+ Responsive UI: Built using Tailwind CSS, offering a clean, mobile-friendly design.
+ Real-time Weather Data: Displays the latest weather information and METAR reports for airports.
+ Customizable Units: Toggle between different measurement units (e.g., metric and imperial).
+ Visual Weather Trends: Showcases weather patterns using dynamic charts.
+ Aviation-Specific Insights: Provides pilots and air traffic controllers with necessary weather data like wind direction, cloud coverage, and barometric pressure.

## Prerequisites

Before you begin, ensure you have met the following requirements:

+ Node.js (version 14 or higher)
+ npm or yarn for package management
+ A running back-end server to provide weather data (e.g., the SIL backend project)

## Installation

To set up Tailwind_frontEnd locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/SIL-Ohjelmistoprojekti/Tailwind_frontEnd.git
```

2. Navigate to the project directory:

``` 
cd Tailwind_frontEnd
``` 
3. Install the necessary dependencies:

``` 
npm install

``` 
or, if you're using yarn:

``` 
yarn install
``` 

4. Start the development server:
``` 
npm start
``` 

or with yarn:

``` 
yarn start
```

This will launch the application in development mode, accessible at ```http://localhost:3000```.

## Available Components

1. Aurinko

File: ```Aurinko.jsx```

The ```Aurinko``` component is responsible for displaying the current position of the sun, including sunrise and sunset times. It dynamically updates based on real-time data, providing users with a visual representation of the sun's location throughout the day.

2. Current

File: ```Current.jsx``` 

The ```Current``` component displays real-time weather data such as temperature, humidity, wind speed, and visibility. It fetches this data from the backend and provides an overview of the current conditions at a specified location (airport or city).

3. Kiilto

File: ```Kiilto.jsx```

The ```Kiilto``` component visualizes solar irradiance and light intensity data. It provides information on sunlight exposure levels, which can be relevant for certain aviation or maintenance activities that rely on clear skies.

4. Metar

File: ```Metar.jsx```

The ```Metar``` component is designed to parse and display METAR reports, which are crucial for aviation. These reports include essential weather information like wind speed, direction, temperature, and visibility at specific airports. It formats the METAR data into a human-readable format.

5. SaaEnnuste

File: ```SaaEnnuste.jsx```

The ```SaaEnnuste``` component is responsible for showing weather forecasts. It uses data from the backend to display predictions on temperature, precipitation, wind, and other key metrics for both short-term and long-term forecasting.

6. UnitToggle

File: ```UnitToggle.jsx```

The ```UnitToggle``` component allows users to switch between different units of measurement, such as Celsius/Fahrenheit for temperature and kilometers/miles for visibility. This adds flexibility to the user experience, catering to both metric and imperial system preferences.

7. WindRecharts
File: ```WindRecharts.jsx```

The ```WindRecharts``` component visualizes wind patterns and trends using Recharts, a charting library for React. It provides a graphical representation of wind speed, direction, and other related data over a specific time period.

## Usage

After running the application, you will have access to the weather dashboard where you can view real-time and forecasted data for various airports. To change between different components or pages, navigate using the top menu (or create navigation links as needed). Each component is modular and can be included or removed based on the specific needs of your weather application.

Example usage in a React component:

```
import React from 'react';
import { UnitProvider } from './context/UnitContext';
import Current from './components/Current';

function App() {
  return (
    <UnitProvider>
      <div className="App">
        <Current />
      </div>
    </UnitProvider>
  );
}

export default App;

```

## Contributing

Contributions are welcome! To contribute to Tailwind_frontEnd:

1. Fork this repository.
2. Create a new branch with your feature or fix.
3. Make your changes.
4. Test thoroughly and ensure everything works correctly.
5. Submit a pull request with a detailed description of the changes.

Please ensure your code follows standard best practices and maintain the coding style of the project.

## License

This project is licensed under the MIT License - see the LICENSE file for more details.

