import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Svg } from 'expo';

export default class Arc extends React.Component {
  render() {
    const radius = this.props.radius;
    const subdivision = this.props.subdivision;
    const angle = (2 * Math.PI) / subdivision;

    let x1 = radius * Math.cos((-Math.PI / 2) - angle/2);
    const y1 = - radius * Math.sin((-Math.PI / 2) - angle/2);

    let x2 = radius * Math.cos((-Math.PI / 2) + angle/2);
    const y2 = - radius * Math.sin((-Math.PI / 2) + angle/2);

    let x0 = 0;
    const y0 = 0;

    const xOffset = - (radius / 2) * Math.sin(this.props.rotation * Math.PI / 180);
    const yOffset = (radius / 2) * Math.cos(this.props.rotation * Math.PI / 180);

    x0 -= x1;
    x2 -= x1;
    x1 -= x1;

    return (
      <View style={{position: 'absolute', height: radius, width: x2, transform: [{ translateY: yOffset - radius/2 }, { translateX: xOffset - x2/2 }, { rotate: `${this.props.rotation || '0'}deg`}]}}>
        <Svg
          height={radius}
          width={x2}
          style={{position: "absolute"}}
        >
          <Svg.Path fill={this.props.color || 'black'} d={`M ${x0} ${y0} L ${x1} ${y1} A ${radius} ${radius}, 0, 0, 0, ${x2} ${y2} Z`} />
        </Svg>
      </View>
    );
  }
}
