import React from 'react';
import { Easing, Animated, StyleSheet, View, Image, Platform, Linking, Dimensions, Alert } from 'react-native';
import { Svg, LinearGradient, Font, Location, Permissions } from 'expo';
import { Button, Icon, Text } from 'react-native-elements';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';

import Wheel from './wheel';
import Distance from './distance';

const WIDTH = Dimensions.get('window').width;

const STROKE = 8;

const BTN_SIZE = 200;

const colors = ['#8C867A','#AA9F76','#8B6189','#936A9A','#B4A3CF'];

const KEY = 'AIzaSyCS7fRjjs9sjhb5EZBj_TCMZuDS-tD5-2Q';

export default class WheelScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    anim: new Animated.Value(0),
    nb: 0,
    selected: 0,
    prec: 0,
    firstRotate: false
  }

  componentWillMount() {
    this.getRestaurant(['']).then(data => {
      let restaurants = []
      for(let i = 0 ; i < data.length ; i ++){
        for(let j = 0 ; j < data[i].length ; j ++){
          restaurants.push({geometry: data[i][j].geometry, name: data[i][j].name, photos: data[i][j].photos, rating: data[i][j].rating, vicinity: data[i][j].vicinity})
        }
      }
      // console.log(restaurants);
      this.setState({res: restaurants, nb: restaurants.length});
      if (restaurants.length == 0) {
        Alert.alert(
          'Aucun restaurants trouvés',
          'Veuyez essayer avec une autre distance',
          [
            {text: 'OK', onPress: () => this.props.navigation.navigate('Distance')},
          ],
          { cancelable: false }
        )

      }
    })
  }

  getRestaurantBis = async (keyword) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    let location = await Location.getCurrentPositionAsync({});

    console.log(location);

    let response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.coords.latitude + ',' + location.coords.longitude + '&&radius='+ this.props.navigation.getParam('distance', 1000) +'&opennow&type=restaurant&keyword=' + keyword + '&key=AIzaSyCS7fRjjs9sjhb5EZBj_TCMZuDS-tD5-2Q');

    let data = await response.json();

    console.log(data.results);

    return data.results;
  }

  getRestaurant = async (keywords) => {
    let res = [];
    for(let i=0 ; i < keywords.length ; i++){
      res[i] = await this.getRestaurantBis(keywords[i]);
    }
    return res;
  }

  getPhoto = (ref) => {
    return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ref+'&key='+KEY;
  }

  startRotation = (nb) => {
    this.setState({firstRotate: true, selected: Math.floor(Math.random() * nb)});
    this.wheel.rotateWheel(()=>this.popupDialog.show());
  }

  openMap = (location,name) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${location.lat},${location.lng}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  }

  render() {
    let { prec, fadeAnim, anim, nb, selected, firstRotate } = this.state;

    let k = '';
    let photo = '';

    if(nb != 0) k = this.state.res[selected].name;

    if(nb != 0) console.log(this.state.res[selected]);
    if(nb != 0) photo = this.getPhoto(this.state.res[selected].photos[0].photo_reference);

    let btn = null;

    if(!firstRotate) btn = (<AwesomeButton onPress={()=>setTimeout(()=>this.startRotation(nb),300)} type="secondary" height={BTN_SIZE} width={BTN_SIZE} borderRadius={BTN_SIZE} >Lancer</AwesomeButton>);

    return (
      <View
        style={{
          flex: 1,
          width: '100%'
        }}
      >
      <PopupDialog
        onDismissed={()=>this.startRotation(nb)}
        width={0.8}
        height={0.8}
        dialogTitle={<DialogTitle title="Résultat" />}
        containerStyle={{position: 'absolute', left: -WIDTH/2}}
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: '80%', height: 150}}
            source={{uri: photo}}
          />
          <Text h3 style={{marginBottom: 10, textAlign: 'center'}}>{k.substring(0,35)}</Text>
          <AwesomeButton style={{marginBottom: 10}} onPress={()=>setTimeout(()=>this.openMap(this.state.res[selected].geometry.location,k),300)} type="primary" >{"S'y rendre"}</AwesomeButton>
          <AwesomeButton style={{marginBottom: 10}} onPress={()=>setTimeout(()=>this.popupDialog.dismiss(),300)} type="secondary" >Relancer</AwesomeButton>
        </View>
      </PopupDialog>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            position: 'absolute',
          }}
        >
          <Wheel nb={nb} selected={selected} ref={(ref) => this.wheel = ref} />
        </View>
        {btn}
        <View
          style={{
            width: STROKE,
            height: '10%',
            backgroundColor: 'white',
            position: 'absolute',
            bottom: -STROKE/2,
            borderRadius: STROKE,
            zIndex: 0
          }}
        />
        <View
          style={{
            width: STROKE,
            height: '18%',
            backgroundColor: 'white',
            position: 'absolute',
            top: -STROKE/2,
            borderRadius: STROKE,
            zIndex: 0

          }}
        />
      </View>
      </View>
    );
  }
}
