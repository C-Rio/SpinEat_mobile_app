import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { Svg, LinearGradient } from 'expo';
import { Icon, Button } from 'react-native-elements';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

const WIDTH = Dimensions.get('window').width;
const COEF = 0.3;
const COEF_SPACE = 0.5;
const SCALING = 2;
const STROKE = 8;

export default class Distance extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    translate: new Animated.Value(0),
    page: 1,
    distances: ['250 m', '500 m', '1 km', '2 km', '5 km', '10 km', '20 km'],
    distancesBis: ['250', '500', '1000', '2000', '5000', '10000', '20000'],
    distances2: ['250 m', '500 m']
  }

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: Animated.event([null, {dx: this.state.translate}]),
      onPanResponderRelease: (evt, gestureState) => {
        const {page, distances} = this.state;
        let toValue = 0;
        if(gestureState.dx < -WIDTH * COEF_SPACE / 2){
          toValue = -WIDTH * COEF_SPACE;
          if(gestureState.dx < -WIDTH * COEF_SPACE){
            toValue = -WIDTH * COEF_SPACE * 2;
            if(page == distances.length-2){
              toValue= -WIDTH * COEF_SPACE;;
            }
          }
          if(page == distances.length-1){
            toValue=0;
          }
        }else if (gestureState.dx > WIDTH * COEF_SPACE / 2){
          toValue = WIDTH * COEF_SPACE;
          if(gestureState.dx > WIDTH * COEF_SPACE){
            toValue = WIDTH * COEF_SPACE * 2;
            if(page == 1){
              toValue= WIDTH * COEF_SPACE;;
            }
          }
          if(page == 0){
            toValue=0;
          }
        }
        Animated.timing(
          this.state.translate,
          {
            toValue,
            duration: 300,
          }
        ).start(() => {
          this.state.translate.setValue(0);
          if(toValue < 0){
            if(toValue < -WIDTH * COEF_SPACE){
              this.setState({page: this.state.page + 2});
            }else{
              this.setState({page: this.state.page + 1});
            }
          }else if(toValue > 0){
            if(toValue > WIDTH * COEF_SPACE){
              this.setState({page: this.state.page - 2});
            }else{
              this.setState({page: this.state.page - 1});
            }
          }
        });
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  render() {
    const { page, distances, distances2 } = this.state;

    console.log('page: ' + page);

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          height: '100%'
        }}
        >

        <View style={styles.container} {...this._panResponder.panHandlers}>
          <Text style={styles.titre}>
            Choisissez une distance
          </Text>
          <View
            style={{
              height: '0%'
            }}
          >
          {
            distances.map((d,i) => {
              const offset = -WIDTH*COEF/2 - WIDTH*COEF_SPACE*page;

              let style_lol = {};

              if(i == page){
                style_lol = {
                  transform: [
                    {scale:
                      this.state.translate.interpolate({
                        inputRange: [-WIDTH/2, -WIDTH/4, 0, WIDTH/4, WIDTH/2],
                        outputRange: [1, 1, SCALING, 1, 1],
                      })
                    }
                  ]
                }
              }

              if(i == page + 1){
                style_lol = {
                  transform: [
                    {scale:
                      this.state.translate.interpolate({
                        inputRange: [-WIDTH, -3*WIDTH/4 ,-WIDTH/2, -WIDTH/4, 0],
                        outputRange: [1, 1 ,SCALING, 1, 1],
                      })
                    }
                  ]
                }
              }

              if(i == page + 2){
                style_lol = {
                  transform: [
                    {scale:
                      this.state.translate.interpolate({
                        inputRange: [-WIDTH, -3*WIDTH/4 ,-WIDTH/2],
                        outputRange: [SCALING, 1, 1],
                      })
                    }
                  ]
                }
              }

              if(i == page - 1){
                style_lol = {
                  transform: [
                    {scale:
                      this.state.translate.interpolate({
                        inputRange: [ 0,WIDTH/4,WIDTH/2,3*WIDTH/4,WIDTH],
                        outputRange: [1, 1 ,SCALING, 1, 1],
                      })
                    }
                  ]
                }
              }

              if(i == page - 2){
                style_lol = {
                  transform: [
                    {scale:
                      this.state.translate.interpolate({
                        inputRange: [WIDTH/2, 3*WIDTH/4, WIDTH],
                        outputRange: [1, 1, SCALING],
                      })
                    }
                  ]
                }
              }

              return (
                <Animated.View
                  key={i}
                  style={
                    {
                    ...Platform.select({
                      ios: {
                        transform: [
                          {translateX: Animated.add(this.state.translate, offset)},
                          {translateY: -WIDTH*COEF/2}
                        ]
                      },
                      android: {
                        left: Animated.add(this.state.translate, offset),
                        top: -WIDTH*COEF/2,
                      },
                    })
                    }
                  }
                >
                  <Animated.View
                    style={[
                      styles.bulle,
                      {
                      left: i * WIDTH * COEF_SPACE,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      backgroundColor: 'white'
                    },
                    style_lol,
                    ]}
                  >
                    <Text style={styles.text}>{d}</Text>
                  </Animated.View>
                </Animated.View>
              );
            })
          }
          </View>
          <View
            style={{
              width: STROKE,
              height: '13%',
              backgroundColor: 'white',
              position: 'absolute',
              bottom: -STROKE/2,
              borderRadius: STROKE,

            }}
          />
          <View
            style={{
              width: STROKE,
              height: '13%',
              backgroundColor: 'white',
              position: 'absolute',
              top: -STROKE/2,
              borderRadius: STROKE,

            }}
          />

        </View>
        <View
          style={{
            position: 'absolute',
            bottom: '20%',
            zIndex: 20
          }}
        >
          <Icon
            reverse
            name='check'
            size={WIDTH*0.1}
            color='white'
            iconStyle={{
              color: '#6AC064'
            }}
            onPress={()=>this.props.navigation.navigate('WheelScreen',{distance: this.state.distancesBis[this.state.page]})}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulle: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: WIDTH * COEF,
    height: WIDTH * COEF,
    borderRadius: WIDTH * COEF,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  text: {
    fontFamily: 'open-sans',
    color: '#686C73',
    fontSize: 30
  },
  titre: {
    fontFamily: 'open-sans',
    color: 'white',
    fontSize: 32,
    position: 'absolute',
    top: '18%'
  }
}

function interpolate(x1,y1,x2,y2,t) {
  const res = ((x2-t)/(x2-x1)) * y1 + ((t-x1)/(x2-x1)) * y2;
  return t < x1 ? y1 : t > x2 ? y2 : res;
}
