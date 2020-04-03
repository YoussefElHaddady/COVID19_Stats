import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

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
  }

  loadingData = () => {
    const apiURL = 'https://corona.lmao.ninja/all';

    return fetch(apiURL)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false,
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
              <Text>Globe</Text>
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
