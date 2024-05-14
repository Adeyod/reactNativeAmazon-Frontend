import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { jwtDecode } from 'jwt-decode';
import { decode } from 'react-native-jwt-decode';
import { UserType } from '../UserContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AddressScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');

      const decodedToken = jwtDecode(token);
      const user = decodedToken.userId;

      setUserId(user);
    };

    fetchUser();
  }, []);

  console.log('user:', userId);
  const handleAddAddress = async () => {
    try {
      const address = {
        name,
        mobileNo,
        houseNo,
        street,
        landmark,
        postalCode,
      };
      if (
        !name ||
        !mobileNo ||
        !houseNo ||
        !street ||
        !landmark ||
        !postalCode
      ) {
        Alert.alert('Please fill all fields');
        return;
      }

      const { data } = await axios.post(
        'http://192.168.43.47:8000/api/users/addresses',
        { userId: userId, address }
      );
      if (data.error) {
        Alert.alert(data.error);
        return;
      } else {
        Alert.alert(data.message);
        setName('');
        setMobileNo('');
        setHouseNo('');
        setStreet('');
        setLandmark('');
        setPostalCode('');

        setTimeout(() => {
          navigation.goBack();
        }, 500);
        return
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: '#00CED1' }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
          Add a new Address
        </Text>

        <TextInput
          placeholderTextColor={'black'}
          placeholder="Nigeria"
          style={{
            padding: 10,
            borderColor: '#D0D0D0',
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            Full name (First and Last name)
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={'black'}
            placeholder="Enter your name"
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            Mobile Number
          </Text>

          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor={'black'}
            placeholder="Mobile no"
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            Flat,House No, Building
          </Text>

          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor={'black'}
            placeholder=""
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            Area,Street,Sector,Village
          </Text>

          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={'black'}
            placeholder=""
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Landmark</Text>

          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholderTextColor={'black'}
            placeholder="Eg near Aso rock"
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pincode</Text>

          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor={'black'}
            placeholder="Enter Pincode"
            style={{
              padding: 10,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>

        <Pressable
          onPress={handleAddAddress}
          style={{
            backgroundColor: '#FFC72C',
            padding: 19,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
