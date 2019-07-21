/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,View, TextInput, Dimensions} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Toast, Content, Root } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import ListItem from "./src/components/listItem/listItem";
import Login from "./src/components/login/login";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {


  async componentDidMount() {
  await Font.loadAsync({
    'Roboto': require('./resources/Roboto.ttf'),
    'Roboto_medium': require('./resources/Roboto_medium.ttf'),
    ...Ionicons.font,
  });
  }

  state = {
    placeName: "",
    places: [],
    location: {
      latitude: 6.2954516,
      longitude: -10.7871876,
      latitudeDelta: 0.04,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.04
    },
    initialRegion: {
      latitude: 6.2954516,
      longitude: -10.7871876,
      latitudeDelta: 0.04,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.04
    },
    pins:[],
    locationChosen : false
  }

  placeNameChangedHandler = event => {
    this.setState({
      placeName: event
    });
    //alert(this.state.placeName);
  };

  fetchPins = () => {
    console.log(this.state);
    fetch(`https://liberia.ngrok.io/api/fetch_pins?latitude=${this.state.location.latitude}&longitude=${this.state.location.longitude}`,{
      headers: {
        "Accept": "application/json"
      }
      })
    .then((pins) => {
        pins.json()
    .then(json => {
      this.setState({
        pins: json
        })
      })
    })
  }

  showClickHandler = () => {
    alert(this.state.places);
  };
  placeSubmitHandler = () => {
    if(this.state.placeName.trim() === ""){
      return;
    }

    this.setState(prevState => {
      places: prevState.places.push(this.state.placeName)
    })

  };

  toastClose = event => {
    console.log(event);
  };

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.setState(prevState => {
      return {
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      };
    })
    Toast.show({
      text: "Is there a checkpoint here?",
      buttonText: "Yes",
      buttonTextStyle: { color: "#008000" },
      buttonStyle: { backgroundColor: "#5cb85c"},
      duration: 5000,
      onClose: (event) => {
        if(event == "user"){
          console.log("button clicked");
          fetch('https://liberia.ngrok.io/api/add-pin', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              },
      body: JSON.stringify({
        user_id: 2,
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude
        }),
        });
        }
      }
    })

  };

  render() {

    let marker = null;
    if(this.state.locationChosen){
      marker = <MapView.Marker
        coordinate ={this.state.location}
        />
    }


    return (

        //<Login/>
        <Root>
        <View style={{flex:1}}/>
        <View style={{flex:3,justifyContent: 'center'}}>
          <View style={{flex:1 , flexDirection: 'row', justifyContent: 'center'}}>
            <Text>
              Checkpointer
            </Text>
          </View>
        </View>
        <View
          style={{flex:5}}
        >
        <GooglePlacesAutocomplete
        placeholder='Enter Location'
        minLength={2}
        autoFocus={false}
        returnKeyType={'default'}
        fetchDetails={true}
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth:0
            },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
            },
        predefinedPlacesDescription: {
          color: '#1faadb'
          },
          }}
  currentLocation={false}
  query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'API KEY',
        language: 'en', // language of the results
        types: '(cities)' // default: 'geocode'
      }}
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
      console.log(this.state.location);
        this.setState({
          location: {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.04,
            longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.04
          }})
          _mapView.animateCamera({
            center: {
              latitude:details.geometry.location.lat,
              longitude:details.geometry.location.lng,
            }
            })
      }}
/>
        </View>
        <View style={{flex:20}}>

        <MapView
        ref = {(mapView) => { _mapView = mapView; }}
        initialRegion={this.state.location}
        style={styles.map}
        onPress = {this.pickLocationHandler}
        onRegionChange = {this.fetchPins}
        >
        {this.state.pins.map((pin) =>
        <MapView.Marker
          coordinate ={pin}
          pinColor = "green"
          />
        )}
        </MapView>

        </View>
        </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  inputBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  placeInput: {
    width: "70%"
  },
  placeButton: {
    width: "30%"
  },
  map: {
    width: "100%",
    height: "100%"
  }

});
