import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Picker,
} from 'react-native';
import {VARS} from '../constants/vars';

export class Settings extends React.Component {
  setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('CS : S saving data error');
    }
  };

  removeItemStorage = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('CS : S removing data error');
    }
  };

  getItemStorage = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
        console.log('CS : S reading data error');
      }
    } catch (error) {
      console.log('CS : S reading data error');
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
    };
  }

  componentDidMount() {
    this.loadingData();
    this.readStorage();
  }

  loadingData = () => {
    console.log('CS : S calling loadingData');
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
        console.log('CS : S calling loadingData error');
      });
  };

  saveChanges = itemValue => {
    this.setState({selectedCountry: itemValue});
    this.saveStorage(itemValue);
  };

  render() {
    const {
      current_country_row,
      current_country_row_title,
      current_country_row_desc,
    } = styles;
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.renderHeader()}
        <View style={current_country_row}>
          <Text style={current_country_row_title}>Your current country : </Text>
          {this.renderCountryPiker()}
        </View>
      </SafeAreaView>
    );
  }

  renderHeader() {
    const {header, header_title_text} = styles;

    return (
      <View style={header}>
        <View>
          <Text style={header_title_text}>Settings</Text>
        </View>
      </View>
    );
  }

  renderCountryPiker() {
    let {isLoading, selectedCountry} = this.state;
    const {country_picker} = styles;
    return (
      <View style={country_picker}>
        {isLoading ? (
          <View>
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
                  value={item.countryInfo.iso3}
                  key={key}
                />
              ))}
          </Picker>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 1,
    borderBottomColor: '#0000',
  },
  header_title_text: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  current_country_row: {
    marginTop: 30,
    marginLeft: 8,
  },
  current_country_row_title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  current_country_row_desc: {
    fontSize: 14,
    color: '#00000055',
  },
  country_picker: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 25,
    margin: 8,
    marginLeft: 0,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
});
