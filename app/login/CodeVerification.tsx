import { BASE_URL } from '@/constants/api';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const CodeVerification = () => {
  const { email } = useLocalSearchParams(); // from previous screen
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Incomplete', 'Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Verified', 'Code accepted. You can now reset your password.');
        router.push({
          pathname: '/login/ResetPassword',
          params: { email }, // pass email to next screen
        });
      } else {
        Alert.alert('Error', data.message || 'Invalid code');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Email</Text>
      <Text style={styles.text1}>Enter code</Text>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text2}>A 6-digit code has been sent to</Text>
        <Text>{email}</Text>
      </View>

      <View style={styles.otpContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.otpBox}>
            <TextInput
              ref={(el) => (inputsRef.current[index] = el)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
              textAlign="center"
            />
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleVerification} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.text3}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default CodeVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    color: "#EB1A1A",
    fontWeight: "bold",
    marginVertical: 10,
  },
  text1: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  text2: {
    maxWidth: "60%",
    textAlign: 'center'
  },
  text3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black"
  },
  button: {
    backgroundColor: '#EB1A1A',
    minWidth: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  otpBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 45,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
    height: '100%',
  },
});
