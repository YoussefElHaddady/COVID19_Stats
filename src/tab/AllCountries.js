import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  Container,
  Badge,
  Header,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
} from 'native-base';
import _ from 'lodash';
import {IMAGE} from '../constants/Images';

import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

export class AllCountries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      fullData: [],
      error: null,
      query: '',
      // timeLaps: 1,
    };
  }

  componentDidMount() {
    // this.interval = setInterval(() => {
    this.loadingData();
    //   }, this.state.timeLaps * 60 * 1000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  loadingData = _.debounce(() => {
    console.log('calling loadingData');
    const apiURL = 'https://corona.lmao.ninja/countries';
    return fetch(apiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
          fullData: responseJson,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  }, 250);

  render() {
    const {container, header_item, search_icon} = styles;
    return (
      <SafeAreaView style={container}>
        <Container style={{width: '100%'}}>
          <Header
            searchBar
            rounded
            androidStatusBarColor="black"
            style={{
              backgroundColor: '#b6b6b6',
              alignItems: 'center',
            }}>
            <Item style={header_item}>
              <Input placeholder="Search..." onChangeText={this.handleSearch} />
              <TouchableOpacity onPress={this.handleSearch}>
                <Image source={IMAGE.ICON_SEARCH} style={search_icon} />
              </TouchableOpacity>
            </Item>
          </Header>
          <List>
            <FlatList
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              // ListFooterComponent={this.renderFooter}
              refreshing={this.state.isLoading}
              onRefresh={this.loadingData}
            />
          </List>
        </Container>
      </SafeAreaView>
    );
  }

  renderItem = ({item, index}) => {
    return (
      <ListItem avatar /* onPress={() => alert(item.country)} */>
        <Left>
          <Thumbnail source={{uri: item.countryInfo.flag}} />
        </Left>
        <Body>
          <Text>{item.country}</Text>
          <Text note>Total Cases : {this.formatNumbers(item.cases)}</Text>
          <Text note>Today Cases : {this.formatNumbers(item.todayCases)}</Text>
        </Body>
        {/* <Right>
            <Text note>3:43 pm</Text>
          </Right> */}
      </ListItem>
    );
  };

  formatNumbers(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  renderFooter = () => {
    if (!this.state.isLoading) return null;
    return (
      <View style={styles.indicator}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, (countries) => {
      if (countries.country.toLowerCase().includes(formattedQuery)) {
        return true;
      }
      return false;
    });
    this.setState({
      data: data,
      query: text,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
  search_icon: {
    width: 25,
    height: 25,
    marginRight: 10,
    opacity: 0.6,
  },
});
