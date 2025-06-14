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
  View,
} from 'react-native';

const OfferingPaymentScreen = () => {
  const [nameOrCode, setNameOrCode] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [useDefaultNumber, setUseDefaultNumber] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Load phone from AsyncStorage
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
      if (!collectRes.ok || !collectData?.data?.id) {
        throw new Error(collectData.error || 'Failed to initiate payment');
      }

      const paymentId = collectData.data.id;
      Alert.alert('Payment Initiated', 'Please complete the payment on your phone.');

      // 2. Wait 70 seconds for user to confirm
      await new Promise(resolve => setTimeout(resolve, 70000));

      // 3. Check payment status
      const statusRes = await fetch(`${BASE_URL}/payment/${paymentId}`);
      const statusData = await statusRes.json();

      const status = statusData?.data?.status;
      const isSuccess = status.toLowerCase() === 'success';

      if (isSuccess) {
        Alert.alert('✅ Payment Successful', 'Your payment was completed and will be recorded.');
      } else {
        Alert.alert('⚠️ Payment Incomplete', 'Payment was not completed. Transaction will be saved for reference.');
      }

      // 4. Save transaction with retry logic
      const MAX_RETRIES = 3;
      const tryCreateTransaction = async () => {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
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
                category: 'Offering',
                status,
                referenceId: paymentId,
              }),
            });

            if (!saveTxRes.ok) {
              const errData = await saveTxRes.json();
              throw new Error(errData.message || 'Failed to store transaction');
            }

            return await saveTxRes.json(); // Success
          } catch (err) {
            console.warn(`Attempt ${attempt} failed: ${err.message}`);
            if (attempt < MAX_RETRIES) {
              await new Promise(res => setTimeout(res, 1000));
            } else {
              throw err;
            }
          }
        }
      };

      await tryCreateTransaction();
    } catch (err) {
      console.error('Payment Error:', err);
      Alert.alert('Error', err.message || 'Something went wrong during payment.');
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
          <Text style={styles.title}>Give an Offering</Text>

          <Text style={styles.scripture}>
            "Each one must give as he has decided in his heart..." — 2 Corinthians 9:7
          </Text>

          <TextInput
            placeholder="Name"
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
                <Text style={styles.payText}>Give Now</Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OfferingPaymentScreen;

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
