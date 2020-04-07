import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Button,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
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
import moment from 'moment';
import _ from 'lodash';
import {IMAGE} from '../constants/images';

export class AllCountries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      fullData: [],
      error: null,
      query: '',
      showModal: false,
      clickedItem: '',
      itemImgUri: '',
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
    let {data, isLoading, showModal, clickedItem, itemImgUri} = this.state;
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
              data={data}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              // ListFooterComponent={this.renderFooter}
              refreshing={isLoading}
              onRefresh={this.loadingData}
            />
          </List>
          {this.renderModal(showModal, clickedItem, itemImgUri)}
        </Container>
      </SafeAreaView>
    );
  }

  renderModal(showModal, clickedItem, itemImgUri) {
    // let {showModal, clickedItem, itemImgUri} = this.state;
    let {navigation} = this.props;
    let {
      back_view,
      modal_main,
      modal_flag_view,
      modal_flag,
      madal_country_name,
      madal_updated,
      modal_main_view,
      modal_main_view_row,
      modal_main_view_row_value,
      modal_main_view_row_type,
      buttons_view,
      button_history,
      button_history_text,
      button_close,
      button_close_text,
      close,
    } = styles;
    return (
      <Modal transparent visible={showModal}>
        <View style={back_view}>
          <View style={modal_flag_view}>
            <TouchableOpacity
              style={close}
              onPress={() => this.setState({showModal: false})}>
              <Image style={close} source={IMAGE.ICON_CLOSE} />
            </TouchableOpacity>
            <Image source={{uri: itemImgUri}} style={modal_flag} />
            <Text style={madal_country_name}>{clickedItem.country}</Text>
            <Text style={madal_updated}>
              last update :{' '}
              {moment(clickedItem.updated).format('DD/MM/YYYY HH:MM')}
            </Text>
          </View>
          <ScrollView style={modal_main}>
            <View style={modal_main_view}>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.cases)}
                </Text>
                <Text style={modal_main_view_row_type}>Cases</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.todayCases)}
                </Text>
                <Text style={modal_main_view_row_type}>Today Cases</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.deaths)}
                </Text>
                <Text style={modal_main_view_row_type}>Deaths</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.todayDeaths)}
                </Text>
                <Text style={modal_main_view_row_type}>Today Deaths</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.recovered)}
                </Text>
                <Text style={modal_main_view_row_type}>Recovered</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.critical)}
                </Text>
                <Text style={modal_main_view_row_type}>Critical</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.active)}
                </Text>
                <Text style={modal_main_view_row_type}>Active</Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.casesPerOneMillion)}
                </Text>
                <Text style={modal_main_view_row_type}>
                  Cases Per One Million
                </Text>
              </View>
              <View style={modal_main_view_row}>
                <Text style={modal_main_view_row_value}>
                  {this.formatNumbers(clickedItem.deathsPerOneMillion)}
                </Text>
                <Text style={modal_main_view_row_type}>
                  Deaths Per One Million
                </Text>
              </View>
              <View style={buttons_view}>
                <TouchableOpacity
                  style={button_history}
                  onPress={() => {
                    this.setState({showModal: false});
                    navigation.navigate('CountryHistory', {
                      title: clickedItem.country + "'s covid19 history",
                      country: clickedItem.country,
                    });
                  }}>
                  <Text style={button_history_text}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={button_close}
                  onPress={() => this.setState({showModal: false})}>
                  <Text style={button_close_text}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  closeModal() {
    this.setState({showModal: false});
  }

  renderItem = ({item, index}) => {
    return (
      <ListItem
        avatar
        onPress={() => {
          this.setState({
            showModal: true,
            clickedItem: item,
            itemImgUri: item.countryInfo.flag,
          });
        }}>
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
    if (num === undefined || num === null) return num;
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

  //modal style
  back_view: {
    backgroundColor: '#000000aa',
    flex: 1,
  },
  close: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modal_flag_view: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000000',
    margin: 20,
    marginTop: 5,
    marginBottom: 0,
    padding: 0,
    zIndex: 1000,
  },
  modal_flag: {
    width: 160,
    height: 160,
    borderRadius: 80,
    margin: 10,
  },
  madal_country_name: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontSize: 50,
    fontWeight: '700',
    fontFamily: 'Roboto',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  madal_updated: {
    width: '100%',
    padding: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  modal_main: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: -50,
    padding: 0,
    borderRadius: 4,
    flex: 1,
  },
  modal_main_view: {
    marginTop: 80,
  },
  modal_main_view_row: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  modal_main_view_row_value: {
    flex: 2,
    padding: 4,
    paddingHorizontal: 16,
    borderRightColor: 'black',
    borderRightWidth: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modal_main_view_row_type: {
    flex: 3,
    padding: 4,
    paddingLeft: 16,
    textAlign: 'left',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  buttons_view: {
    width: '100%',
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button_history: {
    width: 90,
    backgroundColor: '#00000000',
    marginRight: 20,
  },
  button_close: {
    width: 90,
    backgroundColor: '#00000000',
  },
  button_history_text: {
    textAlign: 'right',
    fontSize: 17,
    fontFamily: 'Roboto',
    fontWeight: '900',
    color: '#0275d8',
  },
  button_close_text: {
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '800',
  },
});
