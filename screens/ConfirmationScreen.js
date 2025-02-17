import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserType } from '../UserContext';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { cleanCart } from '../redux/CartReducer';
import RazorpayCheckout from 'react-native-razorpay';

const ConfirmationScreen = () => {
  const steps = [
    { title: 'Address', content: 'Address Form' },
    { title: 'Delivery', content: 'Delivery Options' },
    { title: 'Payment', content: 'Payment Details' },
    { title: 'Place Order', content: 'Order Summary' },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const { cart } = useSelector((state) => state.cart);

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((current, previous) => current + previous, 0)
    .toFixed(2);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.43.47:8000/api/users/addresses/${userId}`
      );
      if (data.error) {
        return;
      } else {
        setAddresses(data.addresses);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const { data } = await axios.post(
        'http://192.168.43.47:8000/api/order/create',
        orderData
      );
      if (data.status === 200 && data.success === true) {
        navigation.navigate('Order');
        dispatch(cleanCart());
        console.log('Order created successfully', data.order);
      } else {
        console.log(data.error);
        Alert.alert(data.error);
      }
    } catch (error) {
      Alert.alert(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pay = async () => {
    try {
      const options = {
        description: 'Adding to wallet',
        currency: 'USD',
        name: 'Amazon',
        key: 'rzp_test_E3GWYimxN7YMk8',
        amount: total * 100,
        prefill: {
          email: 'void@razorpay.com',
          contact: '1234567890',
          name: 'RazorPay Software',
        },
        theme: { color: '#F37254' },
      };

      const data1 = await RazorpayCheckout.open(options);

      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: 'card',
      };

      const { data } = await axios.post(
        'http://192.168.43.47:8000/api/order/create',
        orderData
      );
      if (data.status === 200 && data.success === true) {
        navigation.navigate('Order');
        dispatch(cleanCart());
        console.log('Order created successfully', data.order);
      } else {
        console.log(data.error);
        Alert.alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 55 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'space-between',
          }}
        >
          {steps.map((step, index) => (
            <View
              key={index}
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: 'green' },
                    index <= currentStep && { backgroundColor: 'green' },
                  ]}
                />
              )}

              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  index < currentStep && { backgroundColor: 'green' },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <Text style={{ textAlign: 'center', marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Select Delivery Address
          </Text>

          <Pressable>
            {addresses?.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#D0D0D0',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
              >
                {selectedAddress && selectedAddress._id === item._id ? (
                  <FontAwesome5
                    onPress={() => setSelectedAddress(item)}
                    name="dot-circle"
                    size={24}
                    color="#008397"
                  />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAddress(item)}
                    name="circle"
                    size={24}
                    color="gray"
                  />
                )}

                <View style={{ marginLeft: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                      {item.name}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    {item?.houseNo}, {item?.landmark}
                  </Text>

                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    {item?.street}
                  </Text>

                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    Nigeria, Ekiti State
                  </Text>

                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    Phone No: {item?.mobileNo}
                  </Text>

                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    Postal Code: {item?.postalCode}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 7,
                      gap: 10,
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: 'F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Edit</Text>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: 'F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Remove</Text>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: 'F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Set as Default</Text>
                    </Pressable>
                  </View>

                  <View>
                    {selectedAddress && selectedAddress._id === item._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: '#008397',
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ textAlign: 'center', color: 'white' }}>
                          Deliver to this Address
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      )}

      {currentStep == 1 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Choose your delivery option
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 8,
              gap: 7,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={24} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={24}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text style={{ color: 'green', fontWeight: '500' }}>
                Tomorrow by 11am
              </Text>
              - FREE delivery with your Prime membership
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Select your payment method
          </Text>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption == 'cash' ? (
              <FontAwesome5 name="dot-circle" size={20} color="$008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption('cash')}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Cash on Delivery</Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption == 'card' ? (
              <FontAwesome5 name="dot-circle" size={20} color="$008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption('card');
                  Alert.alert('Debit card', 'Pay Online', [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log('Cancel is pressed');
                      },
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('OK is pressed');
                        pay();
                      },
                    },
                  ]);
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Credit or Debit Card</Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(3)}
            style={{
              backgroundColor: '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === 'cash' && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Now</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                Save 5% and never run out
              </Text>
              <Text style={{ fontSize: 15, color: 'gray', marginTop: 5 }}>
                Turn on auto deliveries
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Item
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>${total}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Delivery
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>0</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'gray' }}>
                Order Total
              </Text>
              <Text
                style={{ color: '#C60C30', fontSize: 17, fontWeight: 'bold' }}
              >
                ${total}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: 'gray' }}>Pay With</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 7 }}>
              Pay on delivery (Cash)
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#D3D3D3' : '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text>Place your order</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
