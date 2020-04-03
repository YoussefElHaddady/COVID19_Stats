import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import {VARS} from '../constants/vars';

export class CurrentCountry extends React.Component {
  getItemStorage = async key => {
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
    // this.getItemStorage(VARS.KEY_COUNTRY).then(result => {
    //   let countr = result;
    //   countr = result === await this.fetchIpLocation();
    //   this.loadingData(result);
    //   this.startService(result);
    // });

    console.log('I m location 0 : ' + this.state.location);
    await this.getItemStorage(VARS.KEY_COUNTRY).then(result => {
      this.setState({
        location: result,
      });
    });
    console.log('I m location 1 : ' + this.state.location);
    if (this.state.location === null) {
      await this.fetchIpLocation().then(result => {
        this.setState({
          location: result,
        });
      });
    }
    console.log('I m location 2 : ' + this.state.location);
    this.loadingData(this.state.location);
    this.startService(this.state.location);
  }

  startService = val => {
    BackgroundTimer.setInterval(() => {
      console.log('I m calling');
      this.loadingData(val);
    }, /* VARS.REFRESH_TIME_LAPS */ 30 * 1000);
  };

  componentWillUnmount = () => {
    BackgroundTimer.clearInterval();
  };

  loadingData = async country => {
    const apiURL = 'https://corona.lmao.ninja/countries/' + country;

    return await fetch(apiURL)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
        this.getItemStorage(VARS.KEY_OLD_CASES_NB).then(nb => {
          if (nb !== null) {
            if (parseInt(nb) !== parseInt(responseJson.cases)) {
              console.log('notify');
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
        });
      });
  };

  fetchIpLocation = async () => {
    const geoIPApiURL = 'https://ipapi.co/json/';

    return await fetch(geoIPApiURL)
      .then(response => response.json())
      .then(responseJson => {
        console.log('location : ' + responseJson.country_name);
        this.setItemStorage(VARS.KEY_COUNTRY, responseJson.country_name);
        return responseJson.country_name;
      })
      .catch(error => {
        this.setState({
          error: error,
        });
      });
  };

  render() {
    let {isLoading, data} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.MainContainer}>
          {isLoading ? (
            <View /* style={{flex: 1, paddingTop: 20}} */>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              {/* <Text>IP : {location.ip}</Text>
              <Text>IP country_name : {location.country_name}</Text>
              <Text>IP country_code_iso3 : {location.country_code_iso3}</Text> */}
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
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
});
