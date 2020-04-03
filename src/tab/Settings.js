import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Picker,
} from 'react-native';
import {VARS} from '../constants/vars';

export class Settings extends React.Component {
  setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('saving data error');
    }
  };

  removeItemStorage = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('removing data error');
    }
  };

  getItemStorage = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        return value;
      } else {
        console.log('reading data error');
      }
    } catch (error) {
      console.log('reading data error');
    }
  };

  saveStorage = value => {
    this.setItemStorage(VARS.KEY_COUNTRY, value);
  };

  removeStorage = () => {
    this.removeItemStorage(VARS.KEY_COUNTRY);
  };

  readStorage = () => {
    this.getItemStorage(VARS.KEY_COUNTRY).then(result => {
      this.setState({
        selectedCountry: result,
      });
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedCountry: '',
      data: [],
      error: null,
      // timeLaps: 1,
    };
  }

  componentDidMount() {
    this.loadingData();
    this.readStorage();
  }

  loadingData = () => {
    console.log('calling loadingData');
    const apiURL = 'https://corona.lmao.ninja/countries';

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

  getPickerSelectedItemValue = () => {
    Alert.alert(this.state.selectedCountry);
  };

  saveChanges = itemValue => {
    this.setState({selectedCountry: itemValue});
    this.saveStorage(itemValue);
  };

  render() {
    let {isLoading, selectedCountry} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <Text>selected country : {this.readStorage()}</Text> */}
        <View style={styles.MainContainer}>
          {isLoading ? (
            <View /* style={{flex: 1, paddingTop: 20}} */>
              <ActivityIndicator />
            </View>
          ) : (
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue, itemIndex) =>
                this.saveChanges(itemValue)
              }>
              {this.state.data
                .sort((a, b) => {
                  return a.country.localeCompare(b.country);
                })
                .map((item, key) => (
                  <Picker.Item
                    label={item.country}
                    value={item.country}
                    key={key}
                  />
                ))}
            </Picker>
          )}
        </View>
        <TouchableOpacity onPress={() => this.removeStorage}>
          <Text>reset</Text>
        </TouchableOpacity>
        {/* <View style={styles.container}>
          <Text>Your Country!</Text>
          <TouchableOpacity onPress={this.saveStorage}>
            <Text>Save String</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.readStorage}>
            <Text>Read String</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.removeStorage}>
            <Text>Remove String</Text>
          </TouchableOpacity>
        </View> */}
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
