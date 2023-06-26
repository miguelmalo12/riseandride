import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

import Header from './components/Header';
import Btn from './components/Btn';
import WeatherIcon from './components/WeatherIcon';

export default function App() {
  const [goingToWorkBtn, setGoingToWorkBtn] = useState(true);
  const [goingOutNowBtn, setGoingOutNowBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [morningForecast, setMorningForecast] = useState(null);
  const [eveningForecast, setEveningForecast] = useState(null);

  // Shows going to work data
  const handlePress = () => {
    setIsLoading(true);
    const apiKey = '3b74bbf9139c13f6add6711c77753049';
    const latVan = '49.325483';
    const lonVan = '-123.127039';
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
      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    });

    if (morningForecast && eveningForecast) {
      const outfit = getOutfitWork(morningForecast, eveningForecast);
      console.log('Outfit recommendation:', outfit);
    }
    setGoingToWorkBtn(false);
    setGoingOutNowBtn(false);
  };

  // Shows going out now data
  const handlePressGoOut = () => {
    setIsLoading(true);
    const apiKey = '3b74bbf9139c13f6add6711c77753049';
    const latVan = '49.325483';
    const lonVan = '-123.127039';
    const allInOneUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latVan}&lon=${lonVan}&exclude=minutely&appid=${apiKey}&units=metric`;
    axios.get(allInOneUrl)
    .then(response => {
      setCurrentData(response.data);
      
      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    });

    if (morningForecast && eveningForecast) {
      const outfit = getOutfitWork(morningForecast, eveningForecast);
      console.log('Outfit recommendation:', outfit);
    }
    setGoingToWorkBtn(false);
    setGoingOutNowBtn(false);
  };

  // Function to refresh the page when clicking
  const handleBackHome = () => {
    setGoingToWorkBtn(true);
    setGoingOutNowBtn(true);
    setWeatherData(null);
    setCurrentData(null);
    setMorningForecast(null);
    setEveningForecast(null);
  };

  // Function to capitalize the first letter of each word in a string
  function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Function to get the outfit recommendation for WORK
  function getOutfitWork(morningForecast, eveningForecast) {
    let outfit = {
      upperPart: '',
      lowerPart: '',
      waterproofPants: 'No',
      gloves: 'No'
    };

    // Upper part
    if (morningForecast.temp > 21 || (morningForecast.temp > 19 && eveningForecast.temp > 26) || eveningForecast.temp > 28) {
      outfit.upperPart = 'Short sleeve';
    } else if (morningForecast.temp >= 14 && morningForecast.temp <= 21 || eveningForecast.temp < 21) {
      outfit.upperPart = 'Thin second layer';
    } else if ((morningForecast.weather[0].id.toString().startsWith('3') || morningForecast.weather[0].id.toString().startsWith('5') || morningForecast.weather[0].id.toString().startsWith('6')) && morningForecast.temp > 15 || eveningForecast.pop > 0.7) {
      outfit.upperPart = 'Thin waterproof second layer';
    } else if (morningForecast.temp < 14) {
      outfit.upperPart = 'Thick second layer';
    }
  
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
  
    // Gloves
    if (morningForecast.temp < 10) {
      outfit.gloves = 'Yes';
    }
  
    return outfit;
  }

  // Function to get the outfit recommendation for GOING OUT NOW
  function getOutfitOutNow(currentData) {
    let outfit = {
      upperPart: '',
      lowerPart: '',
      waterproofPants: 'No',
      gloves: 'No'
    };

    // Upper part
    if (currentData.current.temp > 21) {
      outfit.upperPart = 'Short sleeve';
    } else if (currentData.current.temp >= 15 && currentData.current.temp <= 21) {
      outfit.upperPart = 'Thin second layer';
    } else if ((currentData.current.weather[0].id.toString().startsWith('3') || currentData.current.weather[0].id.toString().startsWith('5') || currentData.current.weather[0].id.toString().startsWith('6')) && currentData.current.temp > 15) {
      outfit.upperPart = 'Thin waterproof second layer';
    } else if (currentData.current.temp < 15) {
      outfit.upperPart = 'Thick second layer';
    }
  
    // Long pants or short pants
    if (currentData.current.temp > 24) {
      outfit.lowerPart = 'Short pants';
    } else {
      outfit.lowerPart = 'Long pants';
    }
  
    // Waterproof pants
    if ((currentData.current.weather[0].id.toString().startsWith('3') || currentData.current.weather[0].id.toString().startsWith('5') || currentData.current.weather[0].id.toString().startsWith('6'))) {
      outfit.waterproofPants = 'Yes';
    }
  
    // Gloves
    if (currentData.current.temp < 6) {
      outfit.gloves = 'Yes';
    }
  
    return outfit;
  }
  
  function getTemperatureColor(temp) {
    if (temp < 6) {
      return '#0000FF'; // Very Cold
    } else if (temp < 12) {
      return '#00BFFF'; // Cold
    } else if (temp < 20) {
      return '#008000'; // Comfortable
    } else if (temp < 25) {
      return '#FFA500'; // Hot
    } else {
      return '#FF0000'; // Very Hot
    }
  }

  function getPrecipitationColor(pop) {
    if (pop < 20) {
      return '#7CFC00'; // No Precipitation
    } else if (pop < 40) {
      return '#9ACD32'; // Low Probability
    } else if (pop < 60) {
      return '#FFD700'; // Medium Probability
    } else if (pop < 80) {
      return '#FFA500'; // High Probability
    } else {
      return '#FF0000'; // Very High Probability
    }
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header handleBackHome={handleBackHome} />

      {/* Outfit Recommendation Going to Work */}
        {morningForecast && eveningForecast && (
          <View>
            <View>
              <Text style={styles.outfitTitle}>Outfit Recommendation:</Text>
            </View>
            <View style={styles.iconsContainer}>
              {getOutfitWork(morningForecast, eveningForecast).upperPart === 'Short sleeve' && <Image source={require('./assets/icons/upper-short.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).upperPart === 'Thin second layer' && <Image source={require('./assets/icons/upper-long.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).upperPart === 'Thin waterproof second layer' && <Image source={require('./assets/icons/upper-long-w.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).upperPart === 'Thick second layer' && <Image source={require('./assets/icons/upper-jacket.png')} style={styles.outfitImage} />}

              {getOutfitWork(morningForecast, eveningForecast).lowerPart === 'Short pants' && <Image source={require('./assets/icons/lower-short.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).lowerPart === 'Long pants' && <Image source={require('./assets/icons/lower-long.png')} style={styles.outfitImage} />}
              
              {getOutfitWork(morningForecast, eveningForecast).waterproofPants === 'Yes at 9AM' && <Image source={require('./assets/icons/lower-long-w.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).waterproofPants === 'Yes at 9AM and 5PM' && <Image source={require('./assets/icons/lower-long-w.png')} style={styles.outfitImage} />}
              {getOutfitWork(morningForecast, eveningForecast).waterproofPants === 'Yes at 5PM' && <Image source={require('./assets/icons/lower-long-w-5PM.png')} style={styles.outfitImage} />}

              {getOutfitWork(morningForecast, eveningForecast).gloves === 'Yes' && <Image source={require('./assets/icons/gloves.png')} style={styles.outfitImage} />}
            </View>
          </View>
        )}

        {/* // Cards showing 9AM and 5PM weather    */}
        {morningForecast && eveningForecast && (
          <View style={styles.forecastContainer}>
            <View style={styles.weatherContainer}>
              <WeatherIcon iconCode={morningForecast.weather[0].icon} />
              <Text style={styles.weatherTitle}>Forecast at 9AM</Text>
              <Text style={styles.weatherDescription}>{morningForecast.weather[0].main} - {capitalize(morningForecast.weather[0].description)}</Text>
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>Temp: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(morningForecast.temp)}]}>{morningForecast.temp.toFixed(1)} °C</Text>
              </View>              
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>Feels: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(morningForecast.feels_like)}]}>{morningForecast.feels_like.toFixed(1)} °C</Text>
              </View> 
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>PoP: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getPrecipitationColor(morningForecast.pop * 100)}]}>{(morningForecast.pop * 100).toFixed(0)} %</Text>
              </View>
              <Text style={styles.bodyText}>Clouds: {morningForecast.clouds.toFixed(0)} %</Text>
              <Text style={styles.bodyText}>Wind: {(morningForecast.wind_speed * 3.6).toFixed(1)} km/h</Text>
            </View>

            <View style={styles.weatherContainer}>
              <WeatherIcon iconCode={eveningForecast.weather[0].icon} />
              <Text style={styles.weatherTitle}>Forecast at 5PM</Text>
              <Text style={styles.weatherDescription}>{eveningForecast.weather[0].main} - {capitalize(eveningForecast.weather[0].description)}</Text>
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>Temp: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(eveningForecast.temp)}]}>{eveningForecast.temp.toFixed(1)} °C</Text>
              </View>              
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>Feels: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(eveningForecast.feels_like)}]}>{eveningForecast.feels_like.toFixed(1)} °C</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.bodyText}>PoP: </Text>
                <Text style={[styles.bodyText, styles.bodyData, {color: getPrecipitationColor(eveningForecast.pop * 100)}]}>{(eveningForecast.pop * 100).toFixed(0)} %</Text>
              </View>              
              <Text style={styles.bodyText}>Clouds: {eveningForecast.clouds.toFixed(0)} %</Text>
              <Text style={styles.bodyText}>Wind: {(eveningForecast.wind_speed * 3.6).toFixed(1)} km/h</Text>
            </View>
          </View>
        )}
      
      {/* Outfit Recommendation Going Out Now */}
        {currentData && (
            <View>
              <View>
                <Text style={styles.outfitTitle}>Outfit Recommendation:</Text>
              </View>
              <View style={styles.iconsContainer}>
                {getOutfitOutNow(currentData).upperPart === 'Short sleeve' && <Image source={require('./assets/icons/upper-short.png')} style={styles.outfitImage} />}
                {getOutfitOutNow(currentData).upperPart === 'Thin second layer' && <Image source={require('./assets/icons/upper-long.png')} style={styles.outfitImage} />}
                {getOutfitOutNow(currentData).upperPart === 'Thin waterproof second layer' && <Image source={require('./assets/icons/upper-long-w.png')} style={styles.outfitImage} />}
                {getOutfitOutNow(currentData).upperPart === 'Thick second layer' && <Image source={require('./assets/icons/upper-jacket.png')} style={styles.outfitImage} />}

                {getOutfitOutNow(currentData).lowerPart === 'Short pants' && <Image source={require('./assets/icons/lower-short.png')} style={styles.outfitImage} />}
                {getOutfitOutNow(currentData).lowerPart === 'Long pants' && <Image source={require('./assets/icons/lower-long.png')} style={styles.outfitImage} />}
                
                {getOutfitOutNow(currentData).waterproofPants === 'Yes' && <Image source={require('./assets/icons/lower-long-w.png')} style={styles.outfitImage} />}

                {getOutfitOutNow(currentData).gloves === 'Yes' && <Image source={require('./assets/icons/gloves.png')} style={styles.outfitImage} />}
              </View>
            </View>
          )}
        

        {/* // Card showing current weather    */}
        {currentData && (
          <View style={styles.weatherContainer}>
            <WeatherIcon iconCode={currentData.current.weather[0].icon} />
            <Text style={styles.weatherTitle}>Current Weather</Text>
            <Text style={styles.weatherDescription}>{currentData.current.weather[0].main} - {capitalize(currentData.current.weather[0].description)}</Text>
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Temp: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(currentData.current.temp)}]}>{currentData.current.temp.toFixed(1)} °C</Text>
            </View> 
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Feels: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(currentData.current.feels_like)}]}>{currentData.current.feels_like.toFixed(1)} °C</Text>
            </View>     
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>PoP: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getPrecipitationColor(currentData.daily[0].pop * 100)}]}>{(currentData.daily[0].pop * 100).toFixed(1)} °C</Text>
            </View> 
            <Text>Clouds: {currentData.current.clouds.toFixed(0)} %</Text>
            <Text>Wind: {(currentData.current.wind_speed * 3.6).toFixed(1)} km/h</Text>
          </View>
        )}

        {/* // Min and Max temperatures    */}
        {currentData && (
          <View style={styles.minMaxContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Max Temperature: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(currentData.daily[0].temp.max)}]}>{currentData.daily[0].temp.max.toFixed(1)} °C</Text>
            </View> 
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Min Temperature: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(currentData.daily[0].temp.min)}]}>{currentData.daily[0].temp.min.toFixed(1)} °C</Text>
            </View>                
          </View>
        )}

        {weatherData && (
          <View style={styles.minMaxContainer}>             
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Max Temperature: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(weatherData.daily[0].temp.max)}]}>{weatherData.daily[0].temp.max.toFixed(1)} °C</Text>
            </View> 
            <View style={styles.dataRow}>
              <Text style={styles.bodyText}>Min Temperature: </Text>
              <Text style={[styles.bodyText, styles.bodyData, {color: getTemperatureColor(weatherData.daily[0].temp.min)}]}>{weatherData.daily[0].temp.min.toFixed(1)} °C</Text>
            </View> 
          </View>
        )}
      {goingToWorkBtn && (
        <Btn onPress={handlePress} title='Going to work!' />
      )}

      {goingOutNowBtn && (
        <Btn onPress={handlePressGoOut} title='Going Out Now!' />
      )}

      {isLoading && (
        <ActivityIndicator style={styles.activityIndicator} size='large' color='#FE633D' />
      )}
      
      {morningForecast && eveningForecast && (
            <Btn onPress={handleBackHome} title='Back Home' />
      )}

      {currentData && (
            <Btn onPress={handleBackHome} title='Back Home' />
      )}

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
    elevation: 3,
  },
  minMaxContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  outfitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  weatherTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
    minHeight: 35,
  },
  dataRow: {
    flexDirection: 'row',
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'left',
  },
  bodyData: {
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  outfitImage: {
    width: 60,
    height: 60,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  activityIndicator: {
    marginTop: 40,
  },
});
