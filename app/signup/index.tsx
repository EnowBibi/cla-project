import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const handleSignUp=()=>{
    router.push('/signup/CompleteProfile');
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
          <Text style={styles.heading}>Create an account</Text>

          <View style={styles.input}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput placeholder='Enter your full name' style={styles.textInput} />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder='Enter your full email' style={styles.textInput} />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput placeholder='Enter your phone number' style={styles.textInput} />
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder='Enter your password'
                secureTextEntry={!passwordVisible}
                style={[styles.textInput, { flex: 1 }]}
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
           <Pressable
            onPress={() => setAgreed(!agreed)}
            style={styles.agreementContainer}
          >
            <View style={[styles.radioOuter, agreed && styles.radioOuterActive]}>
              {agreed && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.agreementText}>
              I’ve read and agreed to{' '}
              <Text style={styles.link}>User Agreement</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </Pressable>
          <Pressable style={styles.button}
            onPress={handleSignUp}
          >
            <Text style={styles.signupText}>Sign up</Text>
          </Pressable>
          <Text style={styles.text1}>
            Already have an account? {''}
            <Pressable onPress={()=>router.push('/signup')}>
               <Text style={styles.text2}>Login</Text>
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
