import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {CurrentCountry, Globe, AllCountries, Settings} from './src/tab';

import {IMAGE} from './src/constants/images';
import {History} from './src/tab/history';

const Tab = createBottomTabNavigator();

const navOptionHandler = () => ({
  headerShown: false,
});

const StackCurrentCountry = createStackNavigator();
function CurrentCountryStack() {
  return (
    <StackCurrentCountry.Navigator initialRouteName="Your Country">
      <StackCurrentCountry.Screen
        name="Your Country"
        component={CurrentCountry}
        options={navOptionHandler}
      />
      <StackCurrentCountry.Screen
        name="CountryHistory"
        component={History}
        options={navOptionHandler}
      />
    </StackCurrentCountry.Navigator>
  );
}

const StackGlobe = createStackNavigator();
function GlobeStack() {
  return (
    <StackGlobe.Navigator initialRouteName="Globe">
      <StackGlobe.Screen
        name="Globe"
        component={Globe}
        options={navOptionHandler}
      />
      <StackGlobe.Screen
        name="CountryHistory"
        component={History}
        options={navOptionHandler}
      />
    </StackGlobe.Navigator>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="black" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Your Country') {
                  iconName = focused
                    ? IMAGE.ICON_CURRENT_COUNTRY_DARK
                    : IMAGE.ICON_CURRENT_COUNTRY;
                } else if (route.name === 'Globe') {
                  iconName = focused ? IMAGE.ICON_GLOBE_DARK : IMAGE.ICON_GLOBE;
                } else if (route.name === 'All Countries') {
                  iconName = focused
                    ? IMAGE.ICON_ALL_COUNTRIES_DARK
                    : IMAGE.ICON_ALL_COUNTRIES;
                } else if (route.name === 'Settings') {
                  iconName = focused
                    ? IMAGE.ICON_SETTINGS_DARK
                    : IMAGE.ICON_SETTINGS;
                }

                return (
                  <Image
                    source={iconName}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                );
              },
            })}
            tabBarOptions={{
              activeTintColor: 'black',
              inactiveTintColor: 'black',
            }}>
            <Tab.Screen name="Your Country" component={CurrentCountryStack} />
            <Tab.Screen name="Globe" component={GlobeStack} />
            <Tab.Screen name="All Countries" component={AllCountries} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
