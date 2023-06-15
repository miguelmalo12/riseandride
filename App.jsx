import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

import Header from './components/Header';
import Btn from './components/Btn';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);

  const handlePress = () => {
    const apiKey = '3b74bbf9139c13f6add6711c77753049';
    const latVan = '49.246292';
    const lonVan = '-123.116226';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latVan}&lon=${lonVan}&appid=${apiKey}&units=metric`;

    axios.get(url)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <Btn onPress={handlePress} title='Ready To Go!' />
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text>Temperature: {weatherData.main.temp.toFixed(1)} °C</Text>
          <Text>Feels Like: {weatherData.main.feels_like.toFixed(1)} °C</Text>
          <Text>Min Temperature: {weatherData.main.temp_min.toFixed(1)} °C</Text>
          <Text>Max Temperature: {weatherData.main.temp_max.toFixed(1)} °C</Text>
          <Text>Wind Speed: {(weatherData.wind.speed * 3.6).toFixed(1)} km/h</Text>
          {/* OpenWeatherMap API doesn't provide rain probability in the current weather data */}
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
    // justifyContent: 'center',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
