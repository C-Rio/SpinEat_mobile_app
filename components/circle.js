import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Arc from './arc';

const palette = ['#55626F','#4DCDC5','#C7F464','#E35F5F','#C44C57'];
// const palette = ['#F44236','#3E50B4','#4CAF4F','#FF9800','#E91E61','#1F95F2','#8BC24B','#FF5522'];

export default class Circle extends React.Component {
  state = {
    colors: null
  }

  componentWillMount() {

  }

  render() {
    let colors = [];
    for(let i = 0 ; i < this.props.subdivision ; i++){
      colors[i] = palette[i % palette.length];
    }

    return (
      <View>
        {colors.map((color,i) => <Arc rotation={(360/colors.length)*i} radius={this.props.radius} subdivision={colors.length} color={color} key={i} />)}
      </View>
    );
  }
}
