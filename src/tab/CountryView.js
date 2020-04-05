import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

import moment from 'moment';

export class CountryView extends Component {
  render() {
    let {
      flag,
      country,
      updated,
      cases,
      recovered,
      todayDeaths,
      todayCases,
      critical,
      casesPerOneMillion,
      active,
      deaths,
      deathsPerOneMillion,
    } = this.props;
    const {
      container,
      card,
      textStyle,
      card_header,
      card_flag,
      card_country_name,
      card_country_name_text,
      card_update_date,
      card_stats,
      card_stat_group,
      card_stat_item,
      card_stat_last_group_item,
      card_stat_value,
      card_stat_type,
    } = styles;
    return (
      <View style={card}>
        <View style={card_header}>
          <Image style={card_flag} source={{uri: flag}} />
          <Text style={[textStyle, card_country_name, card_country_name_text]}>
            {country}
          </Text>
          <Text style={[textStyle, card_update_date]}>
            last update : {moment(updated).format('DD/MM/YYYY HH:MM')}
          </Text>
        </View>

        <View style={card_stats}>
          <View style={card_stat_group}>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}> {cases} </Text>
              <Text style={[textStyle, card_stat_type]}>Cases</Text>
            </View>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}> {recovered} </Text>
              <Text style={[textStyle, card_stat_type]}>Recovered</Text>
            </View>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}> {todayDeaths} </Text>
              <Text style={[textStyle, card_stat_type]}>Today Deaths</Text>
            </View>
          </View>
          <View style={card_stat_group}>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}> {todayCases} </Text>
              <Text style={[textStyle, card_stat_type]}>Today Cases</Text>
            </View>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}> {critical} </Text>
              <Text style={[textStyle, card_stat_type]}>Critical</Text>
            </View>
            <View style={card_stat_item}>
              <Text style={[textStyle, card_stat_value]}>
                {' '}
                {casesPerOneMillion}{' '}
              </Text>
              <Text style={[textStyle, card_stat_type]}>
                cases Per One Million
              </Text>
            </View>
          </View>
          <View style={card_stat_group}>
            <View style={[card_stat_item, card_stat_last_group_item]}>
              <Text style={[textStyle, card_stat_value]}> {active} </Text>
              <Text style={[textStyle, card_stat_type]}>Active</Text>
            </View>
            <View style={[card_stat_item, card_stat_last_group_item]}>
              <Text style={[textStyle, card_stat_value]}> {deaths} </Text>
              <Text style={[textStyle, card_stat_type]}>Deaths</Text>
            </View>
            <View style={[card_stat_item, card_stat_last_group_item]}>
              <Text style={[textStyle, card_stat_value]}>
                {' '}
                {deathsPerOneMillion}{' '}
              </Text>
              <Text style={[textStyle, card_stat_type]}>
                Deaths Per One Million
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    position: 'relative',
    zIndex: 0,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    overflow: 'hidden',
  },
  card_header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_flag: {
    borderRadius: 80,
    width: 160,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 22,
  },
  card_country_name: {
    marginTop: 10,
    marginBottom: 0,
  },
  card_country_name_text: {
    fontSize: 35,
  },
  card_update_date: {
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  card_stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  card_stat_group: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card_stat_item: {
    justifyContent: 'center',
    marginVertical: 8,
    borderRightWidth: 1,
    borderRightColor: 'black',
    minHeight: 60,
    padding: 3,
  },
  card_stat_last_group_item: {
    borderRightWidth: 0,
  },
  card_stat_value: {
    fontSize: 25,
  },
  card_stat_type: {
    fontWeight: 'normal',
  },
});
