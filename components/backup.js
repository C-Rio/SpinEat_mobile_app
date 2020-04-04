import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { Svg, LinearGradient } from 'expo';

const WIDTH = Dimensions.get('window').width;
const COEF = 0.35;
const COEF_SPACE = 0.5;
const SCALING = 1.5;

export default class Distance extends React.Component {
  state = {
    translate: new Animated.Value(0),
    page: 0,
    distances: ['250 m', '500 m', '1 km', '2 km', '5 km', '10 km'],
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
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Text>Salut quand meme</Text>
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
                  {transform: [{translateX: Animated.add(this.state.translate, offset)},{translateY: -WIDTH*COEF/2}]}
                }
              >
                <Animated.View
                  style={[
                    styles.bulle,
                    {
                    left: i * WIDTH * COEF_SPACE,
                  },
                  style_lol
                  ]}
                >
                  <LinearGradient style={{position: 'absolute', borderRadius: WIDTH * COEF, width: WIDTH*COEF, height: WIDTH*COEF}} colors={['#4c669f', '#3b5998', '#192f6a']}/>
                  <Text style={styles.text}>{d}</Text>
                </Animated.View>
              </Animated.View>
            );
          })
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulle: {
    backgroundColor: 'blue',
    width: WIDTH * COEF,
    height: WIDTH * COEF,
    borderRadius: WIDTH * COEF,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  text: {
    color: 'white',
    fontSize: 30
  }
}

function interpolate(x1,y1,x2,y2,t) {
  const res = ((x2-t)/(x2-x1)) * y1 + ((t-x1)/(x2-x1)) * y2;
  return t < x1 ? y1 : t > x2 ? y2 : res;
}
