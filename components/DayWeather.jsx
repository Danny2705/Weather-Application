import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Wind from '../asset/image/wind.png';
import Humidity from '../asset/image/humidity.png';
import Sunrise from '../asset/image/sunrise.png';

export default function DayWeather({data}) {
  const getDayOfWeek = () => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const date = new Date();
    const zone = data.timezone / 3600;
    const currentDayIndex =
      date.getUTCHours() + zone > 24 ? date.getUTCDay() + 1 : date.getUTCDay();
    return daysOfWeek[currentDayIndex];
  };

  const currentDay = getDayOfWeek();
  const {sys, timezone} = data;
  const zone = timezone / 3600;
  const sunriseTime = new Date(sys.sunrise * 1000);
  let adjustedTime = sunriseTime.getUTCHours() + zone;
  if (adjustedTime >= 24) {
    adjustedTime -= 24;
  }

  const period = adjustedTime >= 0 && adjustedTime < 12 ? 'AM' : 'PM';

  const formattedSunrise =
    (adjustedTime >= 0 ? adjustedTime : 12 + adjustedTime) +
    ':' +
    (sunriseTime.getMinutes() < 10 ? '0' : '') +
    sunriseTime.getMinutes() +
    ' ' +
    period;

  return (
    <View style={styles.day}>
      <Text style={{fontSize: 24, fontWeight: 'bold', color: '#474747'}}>
        {currentDay.toUpperCase()}
      </Text>
      <Text style={{fontSize: 24, color: '#474747'}}>
        {data.weather[0].main}
      </Text>

      <View style={styles.dayForecast}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={Wind} style={{width: 30, height: 30}} />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {data.wind.speed} m/s
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={Humidity} style={{width: 30, height: 30}} />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {data.main.humidity}%
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Image source={Sunrise} style={{width: 30, height: 30}} />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {formattedSunrise}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    position: 'absolute',
    top: 280,
  },
  dayForecast: {
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
