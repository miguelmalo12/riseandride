import { Image } from 'react-native';

const WeatherIcon = ({ iconCode }) => {
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={{ uri: iconUrl }}
    />
  );
};

export default WeatherIcon;