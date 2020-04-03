import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {notificationManager} from '../notifications/NotificationManager';

import BackgroundTimer from 'react-native-background-timer';
import {VARS} from '../constants/vars';

export class CurrentCountry extends React.Component {
  getItemStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log('reading data error 2');
    }
  };

  setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('saving data error');
      console.error(error);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentCountry: '',
      data: [],
      location: '',
      error: null,
    };
  }

  async componentDidMount() {
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
    console.log('[Notification] Registered : ', token);
  }

  onNotification(notify) {
    console.log('[Notification] onNotification: ', notify);
  }

  onOpenNotification(notify) {
    console.log('[Notification] onOpenNotification: ', notify);
    this.cancelNotification();
  }

  sendNotification = (title, text) => {
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
    };

    console.log('I have been called with ' + title + ' and ' + text);
    this.localNotify.showNotification(title, text, {}, options);
  };

  cancelNotification = () => {
    this.localNotify.cancelAllLocalNotifications();
  };

  async initComponent() {
    await this.getItemStorage(VARS.KEY_COUNTRY).then((result) => {
      this.setState({
        location: result,
      });
    });
    if (this.state.location === null) {
      await this.fetchIpLocation().then((result) => {
        this.setState({
          location: result,
        });
      });
    }
    this.loadingData(this.state.location);
    this.startService(this.state.location);
  }

  startService = (val) => {
    BackgroundTimer.setInterval(() => {
      console.log('I m calling');
      this.loadingData(val);
    }, VARS.REFRESH_TIME_LAPSE_CURRENT_COUNTRY * 60 * 1000);
  };

  componentWillUnmount = () => {
    BackgroundTimer.clearInterval();
  };

  loadingData = async (country) => {
    const apiURL = 'https://corona.lmao.ninja/countries/' + country;

    return await fetch(apiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
        this.getItemStorage(VARS.KEY_OLD_CASES_NB).then((nb) => {
          if (nb !== null) {
            if (parseInt(nb) !== parseInt(responseJson.cases)) {
              console.log('notify');
              this.cancelNotification();
              this.sendNotification(
                'New cases in ' + responseJson.country,
                'total cases : ' +
                  responseJson.cases +
                  ' today cases : ' +
                  responseJson.todayCases,
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
      .catch((error) => {
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  };

  fetchIpLocation = async () => {
    const geoIPApiURL = 'https://ipapi.co/json/';

    return await fetch(geoIPApiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('location : ' + responseJson.country_name);
        this.setItemStorage(VARS.KEY_COUNTRY, responseJson.country_name);
        return responseJson.country_name;
      })
      .catch((error) => {
        this.setState({
          error: error,
        });
      });
  };

  render() {
    let {isLoading, data} = this.state;
    let {container} = styles;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={container}>
          {isLoading ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Text>{data.country}</Text>
              <Text note>cases : {data.cases}</Text>
              <Text note>todayCases : {data.todayCases}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
