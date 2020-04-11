import * as React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';

import {notificationManager} from '../notifications/NotificationManager';

import {VARS} from '../constants/vars';
import {CountryView} from './CountryView';
import {HistoryLink} from './HistoryLink';
import {NoData} from './NoData';

export class CurrentCountry extends React.Component {
  getItemStorage = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log('CS : Error reading data from AsyncStorage');
      console.error(error);
    }
  };

  setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('CS : Error saving data in AsyncStorage');
      console.error(error);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoaded: false,
      data: [],
      currentCountry: '',
      error: null,
    };
  }

  componentDidMount() {
    this.initComponent();
    this.initNotifications();
  }

  initNotifications() {
    this.localNotify = notificationManager;
    this.localNotify.configure(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
  }

  onRegister(token) {
    console.log('CS : [Notification] Registered : ', token);
  }

  onNotification(notify) {
    console.log('CS : [Notification] onNotification: ', notify);
  }

  onOpenNotification(notify) {
    console.log('CS : [Notification] onOpenNotification: ', notify);
    this.cancelNotification();
  }

  sendNotification = (title, text) => {
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
    };

    console.log('CS : notify with ' + title + ' and ' + text);
    this.localNotify.showNotification(title, text, {}, options);
  };

  cancelNotification = () => {
    console.log('CS : [Notification] cancelNotification');
    this.localNotify.cancelAllLocalNotifications();
  };

  async initComponent() {
    await this.getItemStorage(VARS.KEY_COUNTRY).then(result => {
      this.setState({
        currentCountry: result,
      });
    });
    if (this.state.currentCountry === null) {
      await this.fetchIpLocation().then(result => {
        this.setState({
          currentCountry: result,
        });
      });
    }
    if (
      this.state.currentCountry === undefined ||
      this.state.currentCountry === null
    ) {
      this.setItemStorage(VARS.KEY_COUNTRY, 'MAR');
      this.setState({
        currentCountry: 'MAR',
      });
    }
    this.loadingData(this.state.currentCountry);
    this.startService(this.state.currentCountry);
  }

  startService = val => {
    BackgroundTimer.setInterval(() => {
      this.loadingData(val);
    }, VARS.REFRESH_TIME_LAPSE_CURRENT_COUNTRY * 60 * 1000);
  };

  componentWillUnmount = () => {
    BackgroundTimer.clearInterval();
  };

  loadingData = async country => {
    const apiURL = 'https://corona.lmao.ninja/countries/' + country;
    console.log('CS : CC loadingData');

    return await fetch(apiURL)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          isLoaded: true,
          data: responseJson,
        });
        this.getItemStorage(VARS.KEY_OLD_CASES_NB).then(nb => {
          if (nb !== null) {
            if (parseInt(nb) !== parseInt(responseJson.cases)) {
              this.cancelNotification();
              this.sendNotification(
                'New cases in ' + responseJson.country,
                'total cases : ' +
                  responseJson.cases +
                  '\ntoday cases : ' +
                  responseJson.todayCases +
                  '\ntoday deaths : ' +
                  responseJson.todayDeaths,
              );

              this.setItemStorage(
                VARS.KEY_OLD_CASES_NB,
                responseJson.cases === null
                  ? nb.toString()
                  : responseJson.cases.toString(),
              );
            }
          } else {
            this.setItemStorage(VARS.KEY_OLD_CASES_NB, '0');
          }
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false,
          isLoaded: false,
        });
        console.log('CS : CC loadingData error');
        console.log(error);
      });
  };

  fetchIpLocation = async () => {
    // const geoIPApiURL = 'https://ipapi.co/json/';
    const geoIPApiKey = '5f0fb991f2a34a1dac5e5df9abbc9374';
    const geoIPApiURL =
      'https://api.ipgeolocation.io/ipgeo?apiKey=' + geoIPApiKey;

    console.log('CS : CC fetchIpLocation');

    return await fetch(geoIPApiURL)
      .then(response => response.json())
      .then(responseJson => {
        this.setItemStorage(VARS.KEY_COUNTRY, responseJson.country_code3);
        return responseJson.country_code3;
      })
      .catch(error => {
        this.setState({
          error: error,
        });
        console.log('CS : CC fetchIpLocation error');
        console.log(error);
      });
  };

  render() {
    let {navigation} = this.props;
    let {isLoading, isLoaded, data, currentCountry} = this.state;
    let {container} = styles;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={container}>
          {isLoading ? (
            <View>
              <ActivityIndicator size="large" />
            </View>
          ) : !isLoaded ? (
            <NoData />
          ) : (
            <ScrollView style={{width: '100%'}}>
              <View>
                <CountryView
                  flag={data.countryInfo.flag}
                  country={data.country}
                  updated={data.updated}
                  cases={this.formatNumbers(data.cases)}
                  recovered={this.formatNumbers(data.recovered)}
                  todayDeaths={this.formatNumbers(data.todayDeaths)}
                  todayCases={this.formatNumbers(data.todayCases)}
                  critical={this.formatNumbers(data.critical)}
                  casesPerOneMillion={this.formatNumbers(
                    data.casesPerOneMillion,
                  )}
                  active={this.formatNumbers(data.active)}
                  deaths={this.formatNumbers(data.deaths)}
                  deathsPerOneMillion={this.formatNumbers(
                    data.deathsPerOneMillion,
                  )}
                />
                <HistoryLink
                  navigation={navigation}
                  title={data.country + "'s covid19 history"}
                  country={data.country}
                  link_text="Get Historical Statistics"
                />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }

  formatNumbers(num) {
    if (num === undefined || num === null) return 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
