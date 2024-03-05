import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DeleteIcon from '../asset/image/trash.png';
import {backgroundTheme} from './backgroundTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = ({data, navigation, setWeather}) => {
  const {main, name, weather, timezone} = data;
  const [formattedTime, setFormattedTime] = useState('');

  setInterval(() => {
    const date = new Date();
    const zone = timezone / 3600;
    let adjustedTime = date.getUTCHours() + zone;
    if (adjustedTime >= 24) {
      adjustedTime -= 24;
    }

    const period = adjustedTime >= 0 && adjustedTime < 12 ? 'AM' : 'PM';

    const timeString =
      (adjustedTime >= 0 ? adjustedTime : 12 + adjustedTime) +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes() +
      ' ' +
      period;

    setFormattedTime(timeString);
  }, 1000);

  const handleDelete = async cityToDelete => {
    try {
      const storedCity = await AsyncStorage.getItem('userCity');

      if (storedCity === null) {
        return;
      }

      const cityList = storedCity.split(',');
      const lowercaseCityToDelete = cityToDelete.trim().toLowerCase();

      const updatedCityList = cityList.filter(
        city => city.trim().toLowerCase() !== lowercaseCityToDelete,
      );

      const joinCity = updatedCityList.join(',');
      await AsyncStorage.setItem('userCity', joinCity);

      setWeather(prevWeather =>
        prevWeather.filter(
          item => item.name.toLowerCase() !== lowercaseCityToDelete,
        ),
      );
    } catch (error) {
      console.log('Error' + error);
    }
  };

  const weatherCondition = data.weather[0].main;
  const backgroundColor = getBackgroundColor(weatherCondition);
  const backgroundImage = backgroundColor.image;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('Forecast', {
          data,
          weather,
          backgroundColor,
          backgroundImage,
        })
      }>
      <View>
        <Text style={{fontSize: 24, fontWeight: 'semibold', color: '#474747'}}>
          {name}
        </Text>
        <Text style={{fontSize: 16}}>{formattedTime}</Text>
        <Text style={styles.temp}>{Math.round(main.temp)}°C</Text>
      </View>

      <View style={styles.rightContainer}>
        <Text style={{fontSize: 24, color: '#474747'}}>{weather[0].main}</Text>
        <Image source={backgroundImage} style={styles.catShower} />
      </View>

      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDelete(name)}>
        <Image
          source={DeleteIcon}
          style={{width: 24, height: 24, tintColor: '#474747'}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const getBackgroundColor = weatherCondition => {
  switch (weatherCondition) {
    case 'Clouds':
      return backgroundTheme[0].cloudsColor;
    case 'Rain':
      return backgroundTheme[0].rainColor;
    case 'Drizzle':
      return backgroundTheme[0].drizzleColor;
    case 'Atmosphere':
      return backgroundTheme[0].atmosphereColor;
    case 'Snow':
      return backgroundTheme[0].snowColor;
    case 'Thunderstorm':
      return backgroundTheme[0].thunderstormColor;
    case 'Clear':
      return backgroundTheme[0].clearColor;
    default:
      return backgroundTheme[0].atmosphereColor;
  }
};
export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#B1E0F8',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    height: 170,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 20,
    marginBottom: 10,
  },
  temp: {
    fontSize: 50,
    fontWeight: 'semibold',
    color: '#474747',
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  catShower: {
    width: 120,
    height: 120,
  },
  deleteIcon: {
    position: 'absolute',
    top: 14,
    right: 10,
  },
});
