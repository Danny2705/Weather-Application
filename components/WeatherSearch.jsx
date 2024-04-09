import React, {useCallback, useState} from 'react';
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
        <TouchableOpacity style={styles.searchContainer}>
          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            placeholderTextColor="#8C8C8C"
            value={cityName}
            onChangeText={text => setCityName(text)}
            // Render after user hits enter!!!!
            onSubmitEditing={e => {
              const cleanText = e.nativeEvent.text.trim();
              setCityName(cleanText);
              handleSearch(cleanText);
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    marginTop: 48,
    padding: 16,
    paddingBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#474747',
  },
  searchContainer: {
    position: 'relative',
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 16,
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 24,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: 'bold',
    color: '#474747',
  },
});
