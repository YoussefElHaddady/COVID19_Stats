import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {CurrentCountry, Globe, AllCountries, Settings} from './src/tab';

import {IMAGE} from './src/constants/Images';

const Tab = createBottomTabNavigator();
export default class App extends React.Component {
  render() {
    return (
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
              } else if (route.name === 'All Counties') {
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
            activeTintColor: 'green',
            inactiveTintColor: 'black',
          }}>
          <Tab.Screen name="Your Country" component={CurrentCountry} />
          <Tab.Screen name="Globe" component={Globe} />
          <Tab.Screen name="All Counties" component={AllCountries} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});
