import { BASE_URL } from '@/constants/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    Alert.alert("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Passwords do not match.");
    return;
  }

  if (!agreed) {
    Alert.alert("You must agree to the terms and privacy policy.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, email, phone, password }),
    });

    const data = await response.json();
    if (response.ok) {
       await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
       await AsyncStorage.setItem('token', data.token);
      Alert.alert("Account created successfully!");
      router.push('/signup/CompleteProfile');
    } else {
      Alert.alert(data.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    Alert.alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
          <Text style={styles.heading}>Create an account</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder='Enter your full name'
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder='Enter your email'
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder='Enter your phone number'
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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

          <View style={styles.input}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder='Enter your password again'
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

          {/* Agreement Checkbox */}
          <Pressable onPress={() => setAgreed(!agreed)} style={styles.agreementContainer}>
            <View style={[styles.radioOuter, agreed && styles.radioOuterActive]}>
              {agreed && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.agreementText}>
              I've read and agreed to{' '}
              <Text style={styles.link}>User Agreement</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signupText}>Sign up</Text>
            )}
          </Pressable>


          <Text style={styles.text1}>
            Already have an account?{' '}
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.text2}>Login</Text>
            </Pressable>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Keep your existing styles here (unchanged)

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
    borderWidth: 3,
    width: "80%",
    marginVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
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
    paddingVertical: 8,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '80%',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#002CDD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#002CDD',
  },
  agreementText: {
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  button:{
    backgroundColor:'#EB1A1A',
    minWidth:"80%",
    paddingVertical:15,
    borderRadius:30
  },
  signupText:{
    color:"#ffffff",
    fontSize:16,
    fontWeight:'bold',
    textAlign:"center",
  },
  text1:{
    marginTop:10,
  },
  text2:{
    color:'#EB1A1A',
    fontWeight:'bold'
  }
});
