import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
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
import {DateTime} from 'luxon';

const API_KEY = 'e1f0ab9c632fe4e2fb91c68770021520';

const offsetMinsToZoneStr = mins =>
  `UTC${mins > 0 ? '+' : '-'}${Math.abs(Math.floor(mins / 60))}:${Math.abs(
    mins % 60,
  )
    .toString()
    .padStart(2, '0')}`;

export default function Daily({navigation, data, backgroundColor}) {
  const {name, timezone} = data;
  const [listHour, setListHour] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('Today');

  const fetchWeatherAPI = async name => {
    try {
      setLoaded(false);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&cnt=40&appid=${API_KEY}&units=metric`,
      );
      if (res.status === 200) {
        const responseData = await res.json();
        setListHour(responseData.list);
        console.log(responseData);
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
      <Text style={styles.dayTitle}>{title}</Text>
      <FlatList
        data={listHour}
        keyExtractor={hour => hour.dt}
        renderItem={({item: hour}) => {
          return (
            <View style={styles.hourContainer}>
              <View style={[styles.hourDiv, {backgroundColor}]}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {DateTime.fromSeconds(hour.dt)
                    .setZone(offsetMinsToZoneStr(timezone / 60))
                    .toFormat('h:mm a')}
                </Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
                  }}
                  style={{width: 60, height: 80}}
                />
                <Text style={{fontSize: 16}}>
                  {Math.round(hour.main.temp)}°C
                </Text>
              </View>
            </View>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator
        ListEmptyComponent={
          <View style={styles.loadingHour}>
            <Image source={CatLoadingHour} style={{width: 200, height: 180}} />
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Loading...</Text>
          </View>
        }
        onViewableItemsChanged={info => {
          const item = info.viewableItems[0]?.item;
          if (!item) {
            return;
          }

          const offsetStr = offsetMinsToZoneStr(timezone / 60);
          const nowLocal = DateTime.now().setZone(offsetStr);
          const forecastLocal = DateTime.fromSeconds(item.dt).setZone(
            offsetStr,
          );

          const daysDiff = Math.round(
            Math.abs(forecastLocal.diff(nowLocal).as('days')),
          );
          if (daysDiff === 0) {
            setTitle('Today');
          } else if (daysDiff === 1) {
            setTitle('Tomorrow');
          } else if (daysDiff === 2) {
            setTitle('Day After Tomorrow');
          } else {
            setTitle(`Today Plus ${daysDiff} Days`);
          }
        }}
      />

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
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    flex: 1,
    height: '100%',
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#474747',
    textAlign: 'center',
    width: '100%',
    paddingTop: 8,
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    paddingTopTop: 8,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  hourDiv: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B5D6D6',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 48,
    width: 95,
    height: 180,
  },
  loadingHour: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
