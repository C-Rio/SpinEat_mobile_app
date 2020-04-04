import React from 'react';
import { Easing, Animated, StyleSheet, Text, View } from 'react-native';
import { Svg, LinearGradient, Font } from 'expo';
import { Button } from 'react-native-elements';

import { createStackNavigator } from 'react-navigation';

import Circle from './components/circle';
import Arc from './components/arc';
import Wheel from './components/wheel';
import Distance from './components/distance';
import WheelScreen from './components/wheelscreen';

const colors = ['#8C867A','#AA9F76','#8B6189','#936A9A','#B4A3CF'];

const KEY = 'AIzaSyCS7fRjjs9sjhb5EZBj_TCMZuDS-tD5-2Q';

const Root = createStackNavigator({
  Distance: {
    screen: Distance
  },
  WheelScreen: {
    screen: WheelScreen
  },
},
{
  mode: 'modal',
}
);


export default class App extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    anim: new Animated.Value(0),
    nb: 0,
    selected: 0,
    prec: 0,
    fontLoaded: false,
  }

  async componentDidMount() {
    await Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }


  render() {
    if(!this.state.fontLoaded) return null;

    let { prec, fadeAnim, anim, nb, selected } = this.state;

    return (
      <View style={styles.container}>
        <LinearGradient style={
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            colors={['#4C6BF7','#4CBDF7']}
            start={[1,0]}
            end={[0,1]}
          />
        {/*<Wheel nb={nb} selected={selected} ref={(ref) => this.wheel = ref} />*/}
          {/*<Distance />*/}
        {/*<WheelScreen />*/}
        <View>
          <Root/>
        </View>
        {/*<View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            title='BUTTON'
            rounded
            style={{
              marginTop: 400
            }}
            onPress={() => {this.setState({selected: Math.floor(Math.random() * nb)});this.wheel.rotateWheel();}}
          />
          <Text>{k}</Text>
        </View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
