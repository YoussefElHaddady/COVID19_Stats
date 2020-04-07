import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import {GlobeView} from './GlobeView';
import {VARS} from '../constants/vars';
import {IMAGE} from '../constants/images';
import {HistoryLink} from './HistoryLink';
import {NoData} from './NoData';

export class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoaded: false,
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
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          isLoaded: true,
          data: responseJson,
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false,
          isLoaded: false,
        });
      });
  };

  render() {
    let {navigation} = this.props;
    let {isLoading, isLoaded, data} = this.state;
    let {container, indicatior_view} = styles;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={container}>
          {isLoading ? (
            <View style={indicatior_view}>
              <ActivityIndicator size="large" />
            </View>
          ) : !isLoaded ? (
            <NoData />
          ) : (
            <ScrollView>
              <GlobeView
                updated={data.updated}
                cases={this.formatNumbers(data.cases)}
                deaths={this.formatNumbers(data.deaths)}
                recovered={this.formatNumbers(data.recovered)}
                active={this.formatNumbers(data.active)}
                affectedCountries={this.formatNumbers(data.affectedCountries)}
              />
              <HistoryLink
                navigation={navigation}
                title="World's COVID19 History"
                country="all"
                link_text="Get Historical Statistics"
              />
            </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatior_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
