import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';

import {MenuProvider} from 'react-native-popup-menu';

import NetInfo from '@react-native-community/netinfo';
import Dialog from 'react-native-dialog';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {CurrentCountry, Globe, AllCountries, Settings} from './src/tab';

import {IMAGE} from './src/constants/images';
import {History} from './src/tab/History';

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

const StackAllCountries = createStackNavigator();
function AllCountriesStack() {
  return (
    <StackAllCountries.Navigator initialRouteName="All Countries">
      <StackAllCountries.Screen
        name="All Countries"
        component={AllCountries}
        options={navOptionHandler}
      />
      <StackAllCountries.Screen
        name="CountryHistory"
        component={History}
        options={navOptionHandler}
      />
    </StackAllCountries.Navigator>
  );
}

const App = () => {
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('isInternetReachable: ', isInternetReachable);
      setIsInternetReachable(state.isInternetReachable);
      setIsVisible(!isInternetReachable);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <MenuProvider>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="black" />
        {isInternetReachable ? null : (
          <Dialog.Container visible={isVisible}>
            <Dialog.Title>Oops!</Dialog.Title>
            <Dialog.Description>No Internet Connection</Dialog.Description>
            {/* <Dialog.Button label="Ok" onPress={() => BackHandler.exitApp()} /> */}
            <Dialog.Button label="Ok" onPress={() => setIsVisible(false)} />
          </Dialog.Container>
        )}
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarLabel: () => {
                let tabLabel;

                switch (route.name) {
                  case 'Your Country':
                    tabLabel = 'Your Country';
                    break;
                  case 'Globe':
                    tabLabel = 'Globe';
                    break;
                  case 'All Countries':
                    tabLabel = 'All Countries';
                    break;
                  case 'Settings':
                    tabLabel = 'Settings';
                    break;
                }
                return (
                  <Text style={{textAlign: 'center', fontSize: 11}}>
                    {tabLabel}
                  </Text>
                );
              },
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
            <Tab.Screen name="All Countries" component={AllCountriesStack} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </MenuProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
