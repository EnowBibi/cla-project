import { BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const TithesPaymentScreen = () => {
  const [nameOrCode, setNameOrCode] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [useDefaultNumber, setUseDefaultNumber] = useState(true);
  const [loading, setLoading] = useState(false);

  const [scaleAnim] = useState(new Animated.Value(1));

  // Load user phone from AsyncStorage if using default
  useEffect(() => {
    const loadPhone = async () => {
      try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.phone) setPhone(user.phone.toString());
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    };

    if (useDefaultNumber) loadPhone();
  }, [useDefaultNumber]);

  const handleTogglePhone = () => {
    setUseDefaultNumber(!useDefaultNumber);
    if (!useDefaultNumber) setPhone('');
  };

  const handlePayment = async () => {
  if (!nameOrCode || !amount) {
    Alert.alert('Missing Fields', 'Please enter your name/code and amount.');
    return;
  }

  setLoading(true);

  let finalPhone = phone.replace(/\s+/g, '');
  if (!finalPhone.startsWith('237')) {
    finalPhone = '237' + finalPhone;
  }

  try {
    const token = await AsyncStorage.getItem('token');

    // 1. Initiate payment
    const collectRes = await fetch(`${BASE_URL}/payment/collect-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseInt(amount),
        phoneNumber: finalPhone,
      }),
    });

    const collectData = await collectRes.json();
    console.log(collectData)
    if (!collectRes.ok) {
      throw new Error(collectData.error || 'Failed to initiate payment');
    }

    const paymentId = collectData.data?.id;

    Alert.alert('Payment Initiated', 'Please complete the payment on your phone.');

    // 2. Wait 10 seconds before checking status
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 3. Check payment status
    const statusRes = await fetch(`${BASE_URL}/payment/${paymentId}`);
    const statusData = await statusRes.json();
    console.log("statusData: "+statusData)
    const status = statusData.data?.status;
    console.log("status: "+status)
    const isSuccess = status === 'Success';
    console.log("status: "+status, " success: "+isSuccess)

    // 4. Store transaction
    const saveTxRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nameOrCode,
        amount: parseInt(amount),
        phoneNumber: finalPhone,
        category: 'Tithe', // or dynamic
        status: isSuccess ? 'Success' : 'Failed',
        referenceId: paymentId,
      }),
    });

    if (!saveTxRes.ok) {
      const errData = await saveTxRes.json();
      throw new Error(errData.message || 'Failed to store transaction');
    }

    if (isSuccess) {
      Alert.alert('Success', 'Your payment was successful and recorded.');
    } else {
      Alert.alert('Failed', 'Payment not completed. Transaction saved for reference.');
    }

  } catch (err) {
    console.error(err);
    Alert.alert('Error', err.message || 'An error occurred during payment.');
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Pay Your Tithes</Text>

          <Text style={styles.scripture}>
            "Bring the whole tithe into the storehouse..." — Malachi 3:10
          </Text>

          <TextInput
            placeholder="Name or Tithe Code"
            value={nameOrCode}
            onChangeText={setNameOrCode}
            style={styles.input}
            editable={!loading}
          />

          <TextInput
            placeholder="Amount (XAF)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            editable={!loading}
          />

          {!useDefaultNumber && (
            <TextInput
              placeholder="Phone Number to withdraw with"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              editable={!loading}
            />
          )}

          <Pressable onPress={handleTogglePhone} style={styles.toggleButton} disabled={loading}>
            <Text style={styles.toggleText}>
              {useDefaultNumber
                ? 'Use another phone number'
                : 'Use signed-in phone number'}
            </Text>
          </Pressable>

          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
            <Pressable
              style={[styles.payButton, loading && { opacity: 0.6 }]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>Pay Now</Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TithesPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB1A1A',
    marginTop: 20,
    fontFamily: 'sans-serif',
  },
  scripture: {
    color: '#FFD700',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'sans-serif',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'sans-serif',
  },
  toggleButton: {
    marginTop: -10,
  },
  toggleText: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },
  payButton: {
    marginTop: 20,
    backgroundColor: '#EB1A1A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
