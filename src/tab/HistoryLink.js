import React, {Component} from 'react';
import {TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {IMAGE} from '../constants/images';

export class HistoryLink extends Component {
  render() {
    let {navigation, title, country, link_text} = this.props;
    let {history_link, history_link_text, history_link_image} = styles;
    return (
      <TouchableOpacity
        style={history_link}
        onPress={() =>
          navigation.navigate('CountryHistory', {
            title: title,
            country: country,
          })
        }>
        <Text style={history_link_text}>{link_text}</Text>
        <Image source={IMAGE.ICON_BACK} style={history_link_image} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  history_link: {
    width: '100%',
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 8,
    marginTop: 10,
    marginBottom: 30,
    paddingLeft: 30,
    paddingRight: 15,
  },
  history_link_text: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '400',
  },
  history_link_image: {
    width: 25,
    height: 25,
    rotation: 180,
    opacity: 0.6,
  },
});
