import React from 'react';
import { Easing, Animated, StyleSheet, Text, View } from 'react-native';
import { Svg } from 'expo';
import { Button } from 'react-native-elements';

import Circle from './circle';
import Arc from './arc';

// [`${(360/(nb || 1)) * prec - (nb%2 == 1 ? (360/(nb || 1))/2 : 0)}deg`, `${360*5 + (360/(nb || 1)) * selected - (nb%2 == 1 ? (360/(nb || 1))/2 : 0)}deg`]

const NB_SPIN = 3;
const WHEEL_SIZE = 180;

export default class Wheel extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    anim: new Animated.Value(0),
    prec: 0,
  }

  rotateWheel(callback) {
    let { fadeAnim, selected, anim } = this.state;
    this.setState({prec: this.props.selected});
    fadeAnim.setValue(0);
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2500,              // Make it take a while
        easing: Easing.out(Easing.ease),
      }
    ).start(()=>{if(callback)callback();});                        // Starts the animation
    Animated.timing(                  // Animate over time
      this.state.anim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 900,              // Make it take a while
        easing: Easing.ease,
      }
    ).start();
  }

  static defaultProps = {
    nb : 20,
  }

  render() {
    const { fadeAnim, anim, prec } = this.state;
    const { nb, selected } = this.props;

    // console.log(selected)

    return (
      <Animated.View
        style={{
          width: WHEEL_SIZE*2,
          height: WHEEL_SIZE*2,
          opacity: anim,
          transform: [{
            rotate: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [`${(360/(nb || 1)) * prec - (nb%2 == 1 ? (360/(nb || 1))/2 : 0)}deg`, `${360*NB_SPIN + (360/(nb || 1)) * selected - (nb%2 == 1 ? (360/(nb || 1))/2 : 0)}deg`]
            }),
          },
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 1]
            })
          },
      
          ],
        }}
      >
      <View
        style={{
          position: 'absolute',
          left: WHEEL_SIZE,
          top: WHEEL_SIZE,
        }}
      >
        <Circle radius={WHEEL_SIZE} subdivision={nb} style={{position: 'absolute'}} />
      </View>
      </Animated.View>
    );
  }
}
