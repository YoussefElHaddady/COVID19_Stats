import React from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
} from 'native-base';
import _ from 'lodash';

export default class App extends React.Component {
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
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          data: responseJson,
          fullData: responseJson,
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  }, 250);

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            {/* <Icon name="ios-search" /> */}
            <Input placeholder="Search" onChangeText={this.handleSearch} />
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
    );
  }

  renderItem = ({item, index}) => {
    return (
      <ListItem avatar onPress={() => alert(item.country)}>
        <Left>
          <Thumbnail source={{uri: item.countryInfo.flag}} />
        </Left>
        <Body>
          <Text>{item.country}</Text>
          <Text note>cases : {item.cases}</Text>
          <Text note>todayCases : {item.todayCases}</Text>
        </Body>
        {/* <Right>
          <Text note>3:43 pm</Text>
        </Right> */}
      </ListItem>
    );
  };

  renderFooter = () => {
    if (!this.state.isLoading) return null;
    return (
      <View style={styles.indicator}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, countries => {
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
    backgroundColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});
