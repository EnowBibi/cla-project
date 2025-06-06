import { BASE_URL } from '@/constants/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const ResetPassword = () => {
  const { email } = useLocalSearchParams();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        Alert.alert('Success', 'Password reset successful!');
        router.push('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Reset failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      <Text style={styles.text1}>
        Enter a new password for your account and this time, try to remember it!
      </Text>

      <View style={styles.input}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            style={[styles.textInput, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#555"
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.input}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Enter your password again"
            secureTextEntry={!passwordVisible}
            style={[styles.textInput, { flex: 1 }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#555"
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.buttonText2}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default ResetPassword;

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
    marginVertical: 10,
    paddingHorizontal: 10,
    position: "relative",
    borderRadius: 10,
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#EB1A1A',
    minWidth: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    marginTop: "30%",
    alignItems: 'center',
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
    color: "#EB1A1A"
  },
  text1: {
    marginBottom: 40,
    maxWidth: "70%",
    textAlign: "center"
  },
});
