import AsyncStorage from '@react-native-async-storage/async-storage';

// connect Database
export const storeWeather = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
    console.log('Data Persisted in Cache');
    return value; // Return the original value, not the parsed one
  } catch (err) {
    console.log(err);
  }
};

export const getWeather = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    if (jsonValue === null) {
      console.log('No Data in Cache');
      return []; // Return a default value (empty array) when no data is found
    } else {
      console.log('Retrieved from Cache');
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.log(err);
  }
};
