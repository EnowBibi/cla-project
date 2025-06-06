import { BASE_URL } from '@/constants/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Verification code sent to your email.');
        router.push({
          pathname: '/login/CodeVerification',
          params: { email },
        });
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while sending the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.text1}>
        Provide the email you used to create your account
      </Text>

      <View style={styles.input}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder='Enter your phone  or email'
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <Pressable style={styles.button} onPress={handleContinue} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Request Code</Text>
        )}
      </Pressable>


      <Pressable>
        <Text style={styles.buttonText2}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default ForgotPassword;


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
    marginTop: 10,
    marginBottom: 15,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
  },
  input: {
    borderColor: "#808080",
    borderWidth: 3,
    width: "80%",
    marginVertical: 40,
    paddingHorizontal: 10,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontWeight: "600",
    fontSize: 14,
  },
  
  button: {
    backgroundColor: "#EB1A1A",
    minWidth: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    marginTop:"30%"
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  buttonText2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text1:{
    maxWidth:"70%",
    textAlign:"center"
  },
  
});
