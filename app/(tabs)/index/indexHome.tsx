import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={require('@/assets/images/dummy.png')} style={styles.profileImage} />
        <Text style={styles.welcomeText}>Welcome John!</Text>
      </View>

      {/* Scripture Section */}
      <Text style={styles.scripture}>
        "Give, and it will be given to you. A good measure, pressed down, shaken together and running over..."{'\n'}
        — Luke 6:38
      </Text>

      {/* Giving Options */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={()=>router.push("/tithes")}>
          <Text style={styles.cardText}>Tithes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={()=>router.push("/offering")}>
          <Text style={styles.cardText}>Offering</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={()=>router.push("/donation")}>
          <Text style={styles.cardText}>Donation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={()=>router.push("/specialseed")}>
          <Text style={styles.cardText}>Special Seed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'sans-serif',
  },
  scripture: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 30,
    paddingHorizontal: 12,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    height: 120,
    backgroundColor: '#EB1A1A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
});
