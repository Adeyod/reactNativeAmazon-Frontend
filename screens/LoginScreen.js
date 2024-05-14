import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import SplashScreen from './SplashScreen';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setLoading(false);
          navigation.replace('Main');
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <SplashScreen />;
    // return (
    //   <View style={{ marginTop: 100 }}>
    //     <Text>Wait it is Loading...</Text>
    //   </View>
    // );
  }
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        'http://192.168.43.47:8000/api/users/login',
        user
      );

      const { data } = response;

      if (data.error) {
        Alert.alert(data.error);
      } else {
        Alert.alert(data.message);
        const token = data.token;
        const decode = jwtDecode(token);
        console.log('Token:', decode);

        AsyncStorage.setItem('authToken', token);
        navigation.replace('Main');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: 50,
        paddingVertical: 30,
        backgroundColor: 'white',
        alignItems: 'center',
      }}
    >
      <View>
        <Image
          source={{
            uri: 'http://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png',
          }}
          style={{ width: 150, height: 100 }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginTop: 12,
              color: '#041E42',
            }}
          >
            Login into your account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#D0D0D0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: 'gray',
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Enter your Email"
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#D0D0D0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="gray"
            />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: 'gray',
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Enter your Password"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ color: '#007fff', fontWeight: '500' }}>
            Forgot password
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            width: 200,
            backgroundColor: isLoading ? '#D3D3D3' : '#FEBE10',
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
            }}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 15 }}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
