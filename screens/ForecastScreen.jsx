// Forecast.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import Cloud from '../asset/image/CloudBG.png';
import DayWeather from '../components/DayWeather';
import Daily from '../components/Daily';

const ForecastScreen = ({route, navigation}) => {
  const {data, backgroundColor, backgroundImage} = route.params;
  const {timezone} = data;
  const zone = timezone;
  const date = new Date();

  if (date.getUTCHours() + zone > 24) {
    date.setDate(date.getDate() + 1);
  }

  const currentDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <ScrollView style={backgroundColor.color}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor.color}
      />
      <View style={{backgroundColor: '#F6F6F6'}}>
        <View
          style={[
            styles.forecastContainer,
            {backgroundColor: backgroundColor.color},
          ]}>
          <View style={styles.wrapper}>
            <View>
              <Text style={styles.currentDate}>{currentDate}</Text>
              <Text style={styles.cityName}>
                {data.name}, {data.sys.country}
              </Text>
            </View>
            <Text style={styles.temperature}>
              {Math.round(data.main.temp)}°C
            </Text>
          </View>
          <View>
            <View
              style={{
                height: 400,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Image source={Cloud} style={styles.cloud} />
              <Image
                source={backgroundImage}
                style={{width: 270, height: 300}}
              />
            </View>
            <DayWeather data={data} />
          </View>
        </View>

        <View>
          <Daily
            navigation={navigation}
            data={data}
            backgroundColor={backgroundColor.color}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ForecastScreen;

const styles = StyleSheet.create({
  // forecastContainer: {
  //   // Other styles...
  // },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
  },
  cityName: {
    fontSize: 20,
    color: '#474747',
  },
  currentDate: {
    fontSize: 20,
    color: '#474747',
  },
  temperature: {
    fontSize: 40,
    color: '#474747',
    fontWeight: 'semibold',
  },
  cloud: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.5,
    top: '50%',
  },
});
