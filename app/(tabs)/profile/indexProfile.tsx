import { BASE_URL } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const ProfileScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userData, setUserData] = useState({ fullName: '', email: '', phone: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem('userInfo');
        if (data) {
          const user = JSON.parse(data);
          setUserData({
            fullName: user.name,
            email: user.email,
            phone: user.phone,
          });
          if (user.profileImage) {
            setSelectedImage(user.profileImage);
          }
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    };

    loadUser();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'We need access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      const uri = result.assets[0].uri;

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
              data: base64,
              contentType: 'image/jpeg',
            },
          }),
        });

        const resData = await response.json();
        if (response.ok) {
          setSelectedImage(resData.user.profileImage);
          await AsyncStorage.setItem('userInfo', JSON.stringify(resData.user));
          Alert.alert('Success', 'Profile picture updated!');
        } else {
          Alert.alert('Upload failed', resData.message || 'Something went wrong');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not upload image.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleEdit = () => {
    Alert.alert('Edit Profile', 'Feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.imageContainer}>
        <Image
          source={selectedImage ? { uri: selectedImage } : require('@/assets/images/dummy.png')}
          style={styles.image}
        />
        <Pressable style={styles.editIconContainer} onPress={pickImage}>
          {uploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="pencil" size={20} color="#fff" />
          )}
        </Pressable>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput value={userData.fullName} editable={false} style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput value={userData.email} editable={false} style={styles.input} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={userData.phone} editable={false} style={styles.input} />

        <Pressable onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB1A1A',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editIconContainer: {
    position: 'absolute',
    backgroundColor: '#002CDD',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileSection: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'sans-serif-medium',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f5f5f5',
    fontFamily: 'sans-serif',
  },
  editButton: {
    marginTop: 30,
    backgroundColor: '#EB1A1A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
