import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [unit, setUnit] = useState("C");

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        setRecentSearches((prev) => [cityName, ...prev.filter(city => city !== cityName)]);
        setCityName("");
        setError(null);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  const handleRecentSearch = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const convertTemp = (temp) => {
    return unit === "C" ? temp : (temp * 9 / 5) + 32;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      <button onClick={toggleUnit}>Toggle Unit: &deg;{unit}</button>
      <div>
        {recentSearches.map((city, index) => (
          <button key={index} onClick={() => handleRecentSearch(city)}>
            {city}
          </button>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>
            Temperature: {convertTemp(weatherData.current.temp_c)} °{unit}
          </p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity} %</p>
          <p>Pressure: {weatherData.current.pressure_mb} mb</p>
          <p>Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
    </div>
  );
};

export default App;
