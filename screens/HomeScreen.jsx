import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Button,
} from 'react-native';

import GetLocation from 'react-native-get-location';
import {request, PERMISSIONS} from 'react-native-permissions';
import Card from '../components/Card';
import SearchCat from '../asset/image/searchCat.png';
import CatLoading from '../asset/image/catLoading.png';
import WeatherSearch from '../components/WeatherSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'e1f0ab9c632fe4e2fb91c68770021520';

export default function HomeScreen({navigation}) {
  const [weather, setWeather] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cityName, setCityName] = useState(null);
  const [location, setLocation] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  const fetchWeatherAPI = async city => {
    try {
      setLoaded(false);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (res.status == 200) {
        const data = await res.json();
        setWeather(prevList => [...prevList, data]);
      }
      setLoaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  const currentCity = async myLocation => {
    try {
      const city = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${myLocation.latitude}&lon=${myLocation.longitude}&limit=5&appid=${API_KEY}`,
      );

      if (city.status === 200) {
        const data = await city.json();

        const val = data[0].name.toString();
        setCityName(val);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentUserLocation = async () => {
    try {
      const myLocation = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
        rationale: {
          title: 'Location permission',
          message: 'The app needs the permission to request your location.',
          buttonPositive: 'Ok',
        },
      });

      setMyLocation(myLocation);
      await currentCity(myLocation);
    } catch (error) {
      const {code, message} = error;
      console.warn(code, message);
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      const permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (permissionStatus === 'granted') {
        currentUserLocation();
      } else {
        console.warn('Location permission not granted');
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    loadCity();
    fetchWeatherAPI(cityName);
  }, []);

  const loadCity = async () => {
    try {
      const storedCity = await AsyncStorage.getItem('userCity');
      if (storedCity === null) {
        return;
      }
      const cityList = storedCity.split(',');

      cityList.forEach(city => {
        fetchWeatherAPI(city);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const storeCity = async city => {
    try {
      const storedCity = await AsyncStorage.getItem('userCity');
      if (storedCity === null) {
        await AsyncStorage.setItem('userCity', city);
        return;
      }
      if (storedCity.includes(city)) {
        return;
      }

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (res.status == 200) {
        const data = await res.json();
        let cityList = storedCity + ',' + data.name;
        await AsyncStorage.setItem('userCity', cityList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!loaded) {
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="#F2B6C4" />
        <View style={styles.indicator}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>Loading....</Text>
          <ActivityIndicator size="large" color="#A24E61" />
          <Text style={{fontSize: 25}}>Loading...</Text>
          <Image source={CatLoading} style={{width: 400, height: 400}} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <WeatherSearch
        weather={weather}
        cityName={cityName}
        setCityName={setCityName}
        fetchWeatherAPI={fetchWeatherAPI}
        storeCity={storeCity}
      />
      {weather.length > 0 ? (
        <View
          style={{
            marginTop: 15,
            paddingLeft: 17,
            paddingRight: 17,
          }}>
          {weather.map((weatherData, index) => (
            <Card
              key={index}
              data={weatherData}
              navigation={navigation}
              setWeather={setWeather}
            />
          ))}
        </View>
      ) : (
        <View style={styles.errorInfo}>
          <TouchableOpacity
            style={{backgroundColor: '#86ccf0', borderRadius: 8}}>
            <Button
              title="Get My Location"
              style={[styles.button, styles.buttonPressed]}
              onPress={currentUserLocation}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>
            Type the appropriate city to see the weather...
          </Text>
          <Image source={SearchCat} style={{width: 450, height: 450}} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#F2B6C4',
    gap: 15,
  },
  container: {
    backgroundColor: '#CDECFC',
    // backgroundColor: 'white',
    height: '100%',
  },
  errorInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 17,
    paddingTop: 50,
    gap: 15,
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#cccccc',
  },
  text: {
    color: 'gray',
  },
});
