import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';

import {IMAGE} from '../constants/images';

import moment from 'moment';

export class GlobeView extends Component {
  render() {
    const {
      updated,
      cases,
      deaths,
      recovered,
      active,
      affectedCountries,
    } = this.props;
    const {
      container,
      header,
      header_image,
      header_text_view,
      header_text,
      stats,
      stats_values_column,
      stats_types_column,
      stats_value,
      stats_type,
      stats_values_text,
      stats_types_text,
      header_text_view_2,
      update_date,
    } = styles;

    return (
      <ScrollView style={container}>
        <View style={header}>
          <ImageBackground style={header_image} source={IMAGE.IMG_WORLD_HEADER}>
            <View style={header_text_view}>
              <Text style={header_text}>Global Stats</Text>
            </View>
            <View style={header_text_view_2}>
              <Text style={update_date}>
                updated : {moment(updated).format('DD/MM/YYYY HH:MM')}
              </Text>
            </View>
          </ImageBackground>
          {/* <Text style={header_text}>Globe Stats</Text> */}
        </View>
        <View style={stats}>
          <View style={[stats_values_column]}>
            <Text
              style={[
                stats_value,
                stats_values_text,
                {backgroundColor: '#17a2b8DD'},
              ]}>
              {cases}
            </Text>
            <Text
              style={[
                stats_value,
                stats_values_text,
                {backgroundColor: '#dc3545DD'},
              ]}>
              {deaths}
            </Text>
            <Text
              style={[
                stats_value,
                stats_values_text,
                {backgroundColor: '#28a745DD'},
              ]}>
              {recovered}
            </Text>
            <Text
              style={[
                stats_value,
                stats_values_text,
                {backgroundColor: '#ffc107DD'},
              ]}>
              {active}
            </Text>
            <Text
              style={[
                stats_value,
                stats_values_text,
                {backgroundColor: '#6c757dDD'},
              ]}>
              {affectedCountries}
            </Text>
          </View>
          <View style={stats_types_column}>
            <Text style={[stats_type, stats_types_text]}>Cases</Text>
            <Text style={[stats_type, stats_types_text]}>Deaths</Text>
            <Text style={[stats_type, stats_types_text]}>Recovered</Text>
            <Text style={[stats_type, stats_types_text]}>Active</Text>
            <Text style={[stats_type, stats_types_text]}>
              Affected Countries
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  header: {
    overflow: 'hidden',
    height: 280,
  },
  header_image: {
    width: '100%',
    height: '100%',
  },
  header_text_view: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_text: {
    fontSize: 30,
    color: '#F0F0F0',
    fontWeight: 'bold',
  },
  header_text_view_2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  update_date: {
    fontSize: 15,
    color: 'white',
  },
  stats: {
    padding: 20,
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  stats_values_column: {
    width: 150,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  stats_value: {
    borderRadius: 50,
    backgroundColor: 'blue',
    lineHeight: 30,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  stats_values_text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
  },
  stats_types_column: {
    width: 150,
    justifyContent: 'space-between',
  },
  stats_type: {
    lineHeight: 30,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  stats_types_text: {
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
});
