import { BASE_URL } from '@/constants/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      alert('Please enter your email/phone and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        Alert.alert("Login Successful!");
        router.push('/(tabs)');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
          <Text style={styles.heading}>Welcome Back!!</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Phone Number or Email</Text>
            <TextInput
              placeholder='Enter your phone or email'
              style={styles.textInput}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder='Enter your password'
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

          <Pressable onPress={() => router.push("/login/ForgotPassword")} style={{ width: "80%", marginBottom: 10 }}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </Pressable>

          <Text style={styles.text1}>
            Don't yet have an account?{' '}
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.text2}>Signup</Text>
            </Pressable>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    width: "100%"
  },
  image: {
    height: 160,
    width: 160,
  },
  heading: {
    fontSize: 32,
    color: "#EB1A1A",
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderColor: "#808080",
    borderWidth: 2,
    width: "80%",
    marginVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
    borderRadius: 10,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontWeight: '600',
    fontSize: 14
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 10,
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
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  text1: {
    marginTop: 10,
  },
  text2: {
    color: '#EB1A1A',
    fontWeight: 'bold'
  },
  forgotPassword: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
});
