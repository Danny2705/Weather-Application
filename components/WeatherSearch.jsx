import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchIcon from '../asset/image/search-image.png';

export default function WeatherSearch({
  fetchWeatherAPI,
  cityName,
  setCityName,
  storeCity,
}) {
  const handleSearch = cityName => {
    fetchWeatherAPI(cityName);
    storeCity(cityName);
    setCityName('');
  };
  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#CDECFC" />
      <Text style={styles.h1}>Location</Text>
      <View style={{paddingLeft: 17, paddingRight: 17}}>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => handleSearch(cityName)}>
          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            placeholderTextColor="#8C8C8C"
            value={cityName}
            onChangeText={text => setCityName(text)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    padding: 17,
    paddingBottom: 5,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#474747',
  },
  searchContainer: {
    position: 'relative',
    marginTop: 7,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    marginLeft: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#000',
  },
});
