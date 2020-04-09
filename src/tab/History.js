import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {Accordion, Content, Icon, Badge} from 'native-base';

import {IMAGE} from '../constants/images';
import moment from 'moment';

export class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dates_arr: [],
      cases_arr: [],
      deaths_arr: [],
      recovered_arr: [],
      error: null,
    };
  }

  async componentDidMount() {
    await this.loadingData(this.props.route.params.country);
  }

  loadingData = async (country) => {
    console.log('loading history for : ' + country);
    const apiURL = 'https://corona.lmao.ninja/v2/historical/' + country;

    return await fetch(apiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        country === 'all'
          ? this.setStateForAllTheWorld(responseJson)
          : this.setStateForOneCountry(responseJson);
      })
      .catch((error) => {
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  };

  setStateForOneCountry(responseJson) {
    this.setState({
      dates_arr: Object.keys(responseJson.timeline.cases),
      cases_arr: Object.values(responseJson.timeline.cases),
      deaths_arr: Object.values(responseJson.timeline.deaths),
      recovered_arr: Object.values(responseJson.timeline.recovered),
      isLoading: false,
    });
  }

  setStateForAllTheWorld(responseJson) {
    this.setState({
      dates_arr: Object.keys(responseJson.cases),
      cases_arr: Object.values(responseJson.cases),
      deaths_arr: Object.values(responseJson.deaths),
      recovered_arr: Object.values(responseJson.recovered),
      isLoading: false,
    });
  }

  render() {
    let {route, navigation, isLoading} = this.props;
    const {title} = route.params;
    const {container} = styles;
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.renderHeader(navigation, title)}
        {isLoading ? (
          <View style={container}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={{flex: 1}}>
            {this.renderList(this.getFormattedArray())}
          </View>
        )}
      </SafeAreaView>
    );
  }

  renderHeader(navigation, title) {
    const {
      header,
      header_go_back,
      header_title,
      header_go_back_to,
      header_go_back_icon,
      header_title_text,
    } = styles;

    return (
      <View style={header}>
        <View style={header_go_back}>
          <TouchableOpacity
            style={header_go_back_to}
            onPress={() => navigation.goBack()}>
            <Image
              style={header_go_back_icon}
              source={IMAGE.ICON_BACK}
              resizeMode="contain"
            />
            {/* <Text>Back</Text> */}
          </TouchableOpacity>
        </View>
        <View style={header_title}>
          <Text style={header_title_text}>{title}</Text>
        </View>
        {/* <View style={{flex: 1}}></View> */}
      </View>
    );
  }

  renderList(dataArray) {
    const {list_item_header} = styles;
    return (
      <Content padder>
        <Accordion
          dataArray={dataArray}
          animation={true}
          expanded={0}
          // renderHeader={this.renderListItemHeader}
          headerStyle={list_item_header}
          renderContent={this.renderListItemContent}
        />
      </Content>
    );
  }

  renderListItemContent(item) {
    const {
      item_content,
      item_content_row,
      item_content_text,
      item_content_badge,
      item_content_badge_text,
      item_content_badge_cases,
      item_content_badge_deaths,
      item_content_badge_recovered,
    } = styles;
    return (
      <View style={item_content}>
        <View style={item_content_row}>
          <Text style={item_content_text}>cases : </Text>
          <Badge style={[item_content_badge, item_content_badge_cases]}>
            <Text style={item_content_badge_text}>{item.cases}</Text>
          </Badge>
        </View>
        <View style={item_content_row}>
          <Text style={item_content_text}>deaths : </Text>
          <Badge style={[item_content_badge, item_content_badge_deaths]}>
            <Text style={item_content_badge_text}>{item.deaths}</Text>
          </Badge>
        </View>
        <View style={item_content_row}>
          <Text style={item_content_text}>recovered : </Text>
          <Badge style={[item_content_badge, item_content_badge_recovered]}>
            <Text style={item_content_badge_text}>{item.recovered}</Text>
          </Badge>
        </View>
      </View>
    );
  }

  getFormattedArray() {
    let {dates_arr, cases_arr, deaths_arr, recovered_arr} = this.state;
    let formattedArray = [];
    let desc = true;
    dates_arr.map((val, ind) => {
      formattedArray.push({
        title: this.formattedDate(val),
        cases: this.formatNumbers(cases_arr[ind]),
        deaths: this.formatNumbers(deaths_arr[ind]),
        recovered: this.formatNumbers(recovered_arr[ind]),
      });
    });
    // return formattedArray;
    return desc ? this.orderArray(formattedArray) : formattedArray;
  }

  formattedDate(date_val) {
    // let d = date_val.split('/');
    // let day = parseInt(d[1]) < 10 ? '0' + d[1] : d[1];
    // let month = parseInt(d[0]) < 10 ? '0' + d[0] : d[0];

    // return day + '/' + month + '/' + d[2];
    return moment(date_val, 'M/D/YY').format('DD/MM/YYYY');
  }

  formatNumbers(num) {
    if (num === undefined || num === null) return 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  orderArray(arr) {
    return arr.sort((a, b) => {
      let mA = moment(a.title, 'DD/MM/YYYY');
      let mB = moment(b.title, 'DD/MM/YYYY');
      return mA < mB;
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 1,
    borderBottomColor: '#0000', // invisible color
  },
  header_go_back: {
    width: 30,
    justifyContent: 'center',
  },
  header_go_back_to: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header_go_back_icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  header_title: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 30,
  },
  header_title_text: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  list_item_header: {
    paddingLeft: 18,
    backgroundColor: '#eeeeee',
  },
  item_content: {
    padding: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#dfdfdf',
  },
  item_content_row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_content_text: {
    fontSize: 16,
    fontWeight: '700',
  },
  item_content_badge: {
    margin: 4,
    padding: 5,
    backgroundColor: 'green',
    lineHeight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_content_badge_text: {
    color: 'white',
    margin: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  item_content_badge_cases: {
    backgroundColor: '#17a2b8DD',
  },
  item_content_badge_deaths: {
    backgroundColor: '#dc3545EE',
  },
  // item_content_badge_recovered: {
  //   backgroundColor: '#',
  // },
});
