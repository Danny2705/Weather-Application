import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import CatHome from '../asset/image/catHome.png';
import CatLoadingHour from '../asset/image/drizzleCat.png';

const API_KEY = 'e1f0ab9c632fe4e2fb91c68770021520';

export default function Daily({navigation, data, backgroundColor}) {
  const {name, timezone} = data;
  const [listHour, setListHour] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchWeatherAPI = async name => {
    try {
      setLoaded(false);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&cnt=40&appid=${API_KEY}&units=metric`,
      );
      if (res.status === 200) {
        const responseData = await res.json();
        setListHour(responseData.list);
      }

      setLoaded(true);
    } catch (err) {
      console.log('API connection failed');
    }
  };

  useEffect(() => {
    fetchWeatherAPI(name);
  }, []);

  return (
    <View style={styles.weatherContent}>
      <Text style={styles.dayTitle}>Today</Text>

      {listHour.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {listHour.map((list, index) => {
            const zone = timezone / 3600;
            const forecastTime = new Date(list.dt * 1000);
            let adjustedTime = forecastTime.getUTCHours() + zone;
            if (adjustedTime >= 24) {
              adjustedTime -= 24;
            }

            const period = adjustedTime >= 0 && adjustedTime < 12 ? 'AM' : 'PM';

            const formattedForecastTime =
              (adjustedTime >= 0 ? adjustedTime : 12 + adjustedTime) +
              ':' +
              (forecastTime.getMinutes() < 10 ? '0' : '') +
              forecastTime.getMinutes() +
              ' ' +
              period;

            return (
              <View style={styles.hourContainer} key={index}>
                <View style={[styles.hourDiv, {backgroundColor}]}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    {formattedForecastTime}
                  </Text>
                  <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${list.weather[0].icon}@2x.png`,
                    }}
                    style={{width: 60, height: 80}}
                  />
                  <Text style={{fontSize: 14}}>
                    {Math.round(list.main.temp)}°C
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.loadingHour}>
          <Image source={CatLoadingHour} style={{width: 200, height: 180}} />
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>Loading...</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginTop: 10, width: 60}}>
        <Image source={CatHome} style={{width: 60, height: 70}} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContent: {
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 5,
    // marginTop: 50,
    // paddingTop: 50,
    // backgroundColor: '#F5F9F9',
    flex: 1,
    height: '100%',
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#474747',
    textAlign: 'center',
    width: '100%',
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    marginTop: 7,
    marginRight: 15,
  },
  hourDiv: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#B5D6D6',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 25,
    paddingBottom: 25,
    borderRadius: 55,
  },
  loadingHour: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
