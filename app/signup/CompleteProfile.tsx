import * as ImagePicker from 'expo-image-picker'; // Import the ImagePicker from expo
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const CompleteProfile = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Store the selected image
  const handleContinue=()=>{
    router.push('/(tabs)');
  }
  // Function to open the image picker
  const pickImage = async () => {
    // Request permission to access photos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user selects an image, update the state with the image URI
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a profile picture</Text>
      
      {/* Display selected image or default image */}
      <Image
        source={selectedImage ? { uri: selectedImage } : require('@/assets/images/dummy.png')}
        style={styles.image}
      />
      
      {/* Button to pick an image */}
      <Pressable style={styles.button} onPress={selectedImage?handleContinue:pickImage}>
        <Text style={styles.buttonText}>{selectedImage?"Continue":"Add Photo"}</Text>
      </Pressable>

      {/* Skip button */}
      <Pressable onPress={handleContinue}>
        <Text style={styles.buttonText2}>{selectedImage?"Cancel":"Skip"}</Text>
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
