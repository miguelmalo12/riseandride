import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

import Header from './components/Header';
import Btn from './components/Btn';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastAt5PM, setForecastAt5PM] = useState(null);

  const handlePress = () => {
    const apiKey = '3b74bbf9139c13f6add6711c77753049';
    const latVan = '49.246292';
    const lonVan = '-123.116226';
    const allInOneUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latVan}&lon=${lonVan}&appid=${apiKey}&units=metric`;
    axios.get(allInOneUrl)
      .then(response => {
        setWeatherData(response.data);

        // Function to get the weather data for 5pm
        const hourlyData = response.data.hourly;
        let forecast;

        for (let i = 0; i < hourlyData.length; i++) {
          const date = new Date(hourlyData[i].dt * 1000);
          const timezoneOffset = date.getTimezoneOffset() * 60;
          const localDate = new Date((hourlyData[i].dt + timezoneOffset + response.data.timezone_offset) * 1000);

          if (localDate.getUTCHours() === 17) {
            forecast = hourlyData[i];
            break;
          }
        }

        if (forecast) {
          setForecastAt5PM(forecast);
          console.log('5PM Forecast found!');
        } else {
          console.log('No forecast at 5pm found');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Function to refresh the page when clicking on the logo
  const handleLogoPress = () => {
    setWeatherData(null);
    setForecastAt5PM(null);
  };

  // Function to capitalize the first letter of each word in a string
  function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header handleLogoPress={handleLogoPress} />
      <Btn onPress={handlePress} title='Ready To Go!' />
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text>{weatherData.current.weather[0].main} - {capitalize(weatherData.current.weather[0].description)}</Text>
          <Text>Temperature: {weatherData.current.temp.toFixed(1)} °C</Text>
          <Text>Feels Like: {weatherData.current.feels_like.toFixed(1)} °C</Text>
          <Text>Min Temperature: {weatherData.daily[0].temp.min.toFixed(1)} °C</Text>
          <Text>Max Temperature: {weatherData.daily[0].temp.max.toFixed(1)} °C</Text>
          <Text>Prob of Rain: {(weatherData.daily[0].pop * 100).toFixed(1)} %</Text>
          <Text>Cloud Coverage: {weatherData.current.clouds.toFixed(1)} %</Text>
          <Text>Wind Speed: {(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</Text>
        </View>
      )}
      {forecastAt5PM && (
        <View>
          <Text>Forecast at 5PM:</Text>
          <Text>Temperature: {forecastAt5PM.temp.toFixed(1)} °C</Text>
        </View>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
