import { BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CompleteProfile = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };

  const handleContinue = async () => {
    if (!base64Image) {
      router.push('/(tabs)');
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePicture: {
            data: base64Image,
            contentType: 'image/jpeg',
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        Alert.alert('Profile picture uploaded successfully!');
        router.push('/(tabs)');
      } else {
        Alert.alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Something went wrong!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a profile picture</Text>

      <Image
        source={selectedImage ? { uri: selectedImage } : require('@/assets/images/dummy.png')}
        style={styles.image}
      />

      <Pressable
        style={styles.button}
        onPress={selectedImage ? handleContinue : pickImage}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {selectedImage ? 'Continue' : 'Add Photo'}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText2}>{selectedImage ? 'Cancel' : 'Skip'}</Text>
      </Pressable>
    </View>
  );
};

export default CompleteProfile;

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
    marginBottom: 30,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 40,
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
  buttonText2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
