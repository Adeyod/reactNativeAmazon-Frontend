import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View
      style={{
        marginTop: 350,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontStyle: 'italic',
          fontSize: 20,
          textTransform: 'uppercase',
          marginBottom: -50,
        }}
      >
        Please wait it is loading.....
      </Text>
      <Image
        style={{
          marginLeft: -15,
          width: 300,
          height: 200,
          resizeMode: 'contain',
        }}
        source={{
          uri: 'https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png',
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
