import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import RNRestart from 'react-native-restart';

export class NoData extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 50, color: 'red'}}>No Data !</Text>
        <Text style={{fontSize: 12, textAlign: 'center'}}>
          Check your connection...
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <Text style={{fontSize: 12}}>then </Text>
          <TouchableOpacity onPress={() => RNRestart.Restart()}>
            <Text
              style={{
                fontSize: 14,
                color: 'blue',
                textDecorationLine: 'underline',
              }}>
              Restart the app
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
