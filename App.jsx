import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

import Header from './components/Header';
import Btn from './components/Btn';
import WeatherIcon from './components/WeatherIcon';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [morningForecast, setMorningForecast] = useState(null);
  const [eveningForecast, setEveningForecast] = useState(null);

  // Shows all data cards when the button is pressed
  const handlePress = () => {
    const apiKey = '3b74bbf9139c13f6add6711c77753049';
    const latVan = '49.246292';
    const lonVan = '-123.116226';
    const allInOneUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latVan}&lon=${lonVan}&exclude=minutely&appid=${apiKey}&units=metric`;
    axios.get(allInOneUrl)
    .then(response => {
      setWeatherData(response.data);

      // Function to get the weather data for 9am and 5pm
      const hourlyData = response.data.hourly;
      let morningForecast, eveningForecast;

      for (let i = 0; i < hourlyData.length; i++) {
        const date = new Date(hourlyData[i].dt * 1000);
        const timezoneOffset = date.getTimezoneOffset() * 60;
        const localDate = new Date((hourlyData[i].dt + timezoneOffset + response.data.timezone_offset) * 1000);

        if (localDate.getHours() === 9 && !morningForecast) {
          morningForecast = hourlyData[i];
        }
        if (localDate.getHours() === 17 && !eveningForecast) {
          eveningForecast = hourlyData[i];
        }
        if (morningForecast && eveningForecast) {
          break;
        }
      }

      if (morningForecast) {
        setMorningForecast(morningForecast);
        console.log('9AM Forecast found!');
      } else {
        console.log('No forecast at 9am found');
      }

      if (eveningForecast) {
        setEveningForecast(eveningForecast);
        console.log('5PM Forecast found!');
      } else {
        console.log('No forecast at 5pm found');
      }
    })
    .catch(error => {
      console.error(error);
    });

    if (morningForecast && eveningForecast) {
      const outfit = getOutfitRecommendation(morningForecast, eveningForecast);
      console.log('Outfit recommendation:', outfit);
    }

  };

  // Function to refresh the page when clicking on the logo
  const handleLogoPress = () => {
    setWeatherData(null);
    setMorningForecast(null);
    setEveningForecast(null);
  };

  // Function to capitalize the first letter of each word in a string
  function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Function to get the outfit recommendation based on the weather data
  function getOutfitRecommendation(morningForecast, eveningForecast) {
    let outfit = {
      upperPart: '',
      lowerPart: '',
      waterproofPants: 'No',
      gloves: 'No'
    };
  
    // Long pants or short pants
    if (morningForecast.temp > 21 || (morningForecast.temp > 19 && eveningForecast.temp > 26) || eveningForecast.temp > 28) {
      outfit.lowerPart = 'Short pants';
    } else {
      outfit.lowerPart = 'Long pants';
    }
  
    // Waterproof pants
    if ((morningForecast.weather[0].id.toString().startsWith('3') || morningForecast.weather[0].id.toString().startsWith('5') || morningForecast.weather[0].id.toString().startsWith('6')) || morningForecast.pop > 0.9) {
      outfit.waterproofPants = 'Yes at 9AM';
    }
    if (eveningForecast.pop > 0.8) {
      outfit.waterproofPants = outfit.waterproofPants === 'Yes at 9AM' ? 'Yes at 9AM and 5PM' : 'Yes at 5PM';
    }
  
    // Upper part
    if (morningForecast.temp > 21 || (morningForecast.temp > 19 && eveningForecast.temp > 26) || eveningForecast.temp > 28) {
      outfit.upperPart = 'Short sleeve';
    } else if (morningForecast.temp >= 12 && morningForecast.temp <= 21 || eveningForecast.temp < 20) {
      outfit.upperPart = 'Thin second layer ';
    } else if ((morningForecast.weather[0].id.toString().startsWith('3') || morningForecast.weather[0].id.toString().startsWith('5') || morningForecast.weather[0].id.toString().startsWith('6')) && morningForecast.temp > 15 || eveningForecast.pop > 0.6) {
      outfit.upperPart = 'Thin waterproof second layer';
    } else if (morningForecast.temp < 12) {
      outfit.upperPart = 'Thick second layer';
    }
  
    // Gloves
    if (morningForecast.temp < 8) {
      outfit.gloves = 'Yes';
    }
  
    return outfit;
  }
  
  function getTemperatureColor(temp) {
    if (temp < 0) {
      return '#0000FF'; // Very Cold
    } else if (temp < 10) {
      return '#00BFFF'; // Cold
    } else if (temp < 20) {
      return '#008000'; // Comfortable
    } else if (temp < 30) {
      return '#FFA500'; // Hot
    } else {
      return '#FF0000'; // Very Hot
    }
  }
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header handleLogoPress={handleLogoPress} />
      {/* // Card showing current weather    */}
        {/* {weatherData && (
          <View style={styles.weatherContainer}>
            <WeatherIcon iconCode={weatherData.current.weather[0].icon} />
            <Text style={styles.weatherTitle}>Current Weather:</Text>
            <Text style={styles.weatherDescription}>{weatherData.current.weather[0].main} - {capitalize(weatherData.current.weather[0].description)}</Text>
            <Text>Temperature: {weatherData.current.temp.toFixed(1)} °C</Text>
            <Text>Feels Like: {weatherData.current.feels_like.toFixed(1)} °C</Text>
            <Text>Prob of Rain: {(weatherData.daily[0].pop * 100).toFixed(1)} %</Text>
            <Text>Cloud Coverage: {weatherData.current.clouds.toFixed(1)} %</Text>
            <Text>Wind Speed: {(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</Text>
          </View>
        )} */}
        
        {morningForecast && eveningForecast && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTitle}>Outfit Recommendation:</Text>
            <Text>Upper Part: {getOutfitRecommendation(morningForecast, eveningForecast).upperPart}</Text>
            <Text>Lower Part: {getOutfitRecommendation(morningForecast, eveningForecast).lowerPart}</Text>
            <Text>Waterproof Pants: {getOutfitRecommendation(morningForecast, eveningForecast).waterproofPants}</Text>
            <Text>Gloves: {getOutfitRecommendation(morningForecast, eveningForecast).gloves}</Text>
          </View>
        )}

        {morningForecast && eveningForecast && (
          <View style={styles.forecastContainer}>
            <View style={styles.weatherContainer}>
              <WeatherIcon iconCode={morningForecast.weather[0].icon} />
              <Text style={styles.weatherTitle}>Forecast at 9AM</Text>
              <Text style={styles.weatherDescription}>{morningForecast.weather[0].main} - {capitalize(morningForecast.weather[0].description)}</Text>
              <Text style={styles.bodyText}>Temperature: {morningForecast.temp.toFixed(1)} °C</Text>
              <Text style={styles.bodyText}>Feels Like: {morningForecast.feels_like.toFixed(1)} °C</Text>
              <Text style={styles.bodyText}>Prob of Rain: {(morningForecast.pop * 100).toFixed(1)} %</Text>
              <Text style={styles.bodyText}>Cloud Coverage: {morningForecast.clouds.toFixed(1)} %</Text>
              <Text style={styles.bodyText}>Wind Speed: {(morningForecast.wind_speed * 3.6).toFixed(1)} km/h</Text>
            </View>

            <View style={styles.weatherContainer}>
              <WeatherIcon iconCode={eveningForecast.weather[0].icon} />
              <Text style={styles.weatherTitle}>Forecast at 5PM</Text>
              <Text style={styles.weatherDescription}>{eveningForecast.weather[0].main} - {capitalize(eveningForecast.weather[0].description)}</Text>
              <Text style={[styles.bodyText, {color: getTemperatureColor(eveningForecast.temp)}]}>Temperature: {eveningForecast.temp.toFixed(1)} °C</Text>
              <Text style={styles.bodyText}>Feels Like: {eveningForecast.feels_like.toFixed(1)} °C</Text>
              <Text style={styles.bodyText}>Prob of Rain: {(eveningForecast.pop * 100).toFixed(1)} %</Text>
              <Text style={styles.bodyText}>Cloud Coverage: {eveningForecast.clouds.toFixed(1)} %</Text>
              <Text style={styles.bodyText}>Wind Speed: {(eveningForecast.wind_speed * 3.6).toFixed(1)} km/h</Text>
            </View>
          </View>
        )}

        {weatherData && (
          <View style={styles.minMaxContainer}>
            <Text>Min Temperature: {weatherData.daily[0].temp.min.toFixed(1)} °C</Text>
            <Text>Max Temperature: {weatherData.daily[0].temp.max.toFixed(1)} °C</Text>
          </View>
        )}
      <Btn onPress={handlePress} title='Ready To Go!' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  weatherContainer: {
    width: '45%',
    marginTop: 20,
    alignItems: 'center',
    padding: 12,
    paddingTop: 10,
    borderRadius: 5,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  minMaxContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'left',
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'left',
  },
});
