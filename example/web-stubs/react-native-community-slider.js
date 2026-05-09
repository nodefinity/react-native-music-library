import React from 'react';
import { View, Text } from 'react-native';

export default function Slider({
  value = 0,
  minimumValue = 0,
  maximumValue = 1,
  style,
}) {
  const pct = Math.round(
    ((value - minimumValue) / (maximumValue - minimumValue)) * 100
  );
  return (
    <View
      style={[{ height: 4, backgroundColor: '#ddd', borderRadius: 2 }, style]}
    >
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: '#007AFF',
          borderRadius: 2,
        }}
      />
    </View>
  );
}
