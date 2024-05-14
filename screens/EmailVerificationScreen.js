import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EmailVerificationScreen = () => {
  const [pins, setPins] = useState(['', '', '', '', '', '']);

  const navigation = useNavigation();

  const handleToken = async () => {
    const value = pins.join('');
    const token = parseInt(value, 10);

    try {
      const { data } = await axios.get(
        `http://192.168.43.47:8000/api/users/verify/${token}`
      );

      if (data.error) {
        Alert.alert(data.error);
      } else {
        Alert.alert(data.message);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (text, index) => {
    const newPins = [...pins];
    newPins[index] = text;
    setPins(newPins);

    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].focus();
    }
    // Handle input validation or further logic here
  };

  const inputRefs = [];

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
        {pins.map((pin, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs[index] = ref)}
            style={styles.input}
            value={pin}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            onFocus={() => {
              // clear input when focused
              const newPins = [...pins];
              newPins[index] = '';
              setPins(newPins);
            }}
            onBlur={() => {
              // Ensure all inputs have a value when blurred
              const newPins = [...pins];
              if (newPins[index] === '') {
                newPins[index] = '';
                setPins(newPins);
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && index > 0) {
                // Move focus to the previous input on backspace press
                inputRefs[index - 1].focus();
              }
            }}
          />
        ))}
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Input your verification token
        </Text>
        <Pressable
          onPress={handleToken}
          style={{
            marginTop: 50,
            width: 200,
            backgroundColor: '#FEBE10',
            borderRadius: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Verify Email
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: 'gray',
    // borderRadius: 5,
    // marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 18,
  },
});
