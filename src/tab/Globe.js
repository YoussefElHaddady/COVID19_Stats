import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import {GlobeView} from './GlobeView';
import {VARS} from '../constants/vars';

export class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      error: null,
    };
  }

  componentDidMount() {
    this.loadingData();
    this.startService();
  }

  startService = () => {
    BackgroundTimer.setInterval(() => {
      this.loadingData();
    }, VARS.REFRESH_TIME_LAPSE_GLOBE * 60 * 1000);
  };

  componentWillUnmount = () => {
    BackgroundTimer.clearInterval();
  };

  loadingData = () => {
    const apiURL = 'https://corona.lmao.ninja/all';

    return fetch(apiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          isLoading: false,
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
            <View /* style={{flex: 1, paddingTop: 20}} */>
              <ActivityIndicator />
            </View>
          ) : (
            <GlobeView
              updated={data.updated}
              cases={this.formatNumbers(data.cases)}
              deaths={this.formatNumbers(data.deaths)}
              recovered={this.formatNumbers(data.recovered)}
              active={this.formatNumbers(data.active)}
              affectedCountries={this.formatNumbers(data.affectedCountries)}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  formatNumbers(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
