import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Forecast from './screens/ForecastScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name="Forecast"
          component={Forecast}
          options={{animation: 'slide_from_right'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainScreen: {
    backgroundColor: '#CDECFC',
    // height: '100%',
    flex: 1,
  },
});

export default App;
