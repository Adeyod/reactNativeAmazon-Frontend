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
import React, { useState } from 'react';
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      const user = {
        name: name,
        email: email,
        password: password,
      };

      setLoading(true);
      const { data } = await axios.post(
        'http://192.168.43.47:8000/api/users/register',
        user
      );

      if (data.error) {
        Alert.alert(data.error);
        console.log(data.error);
      } else {
        Alert.alert(data.message);
        console.log(data.message);
        navigation.navigate('EmailVerification');
      }
    } catch (error) {
    } finally {
      setLoading(false);
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
            Register a new account
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
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: 'gray',
                marginVertical: 10,
                width: 300,
                fontSize: name ? 16 : 16,
              }}
              placeholder="Enter your Name"
            />
          </View>
        </View>

        <View style={{}}>
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

        <View>
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
          onPress={handleRegister}
          style={{
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
            }}
          >
            {loading ? 'Loading...' : 'Register'}
          </Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 15 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
            Have an account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
