import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const DonationPaymentScreen = () => {
  const [nameOrCode, setNameOrCode] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [useDefaultNumber, setUseDefaultNumber] = useState(true);

  const [scaleAnim] = useState(new Animated.Value(1));

  const handleTogglePhone = () => {
    setUseDefaultNumber(!useDefaultNumber);
    if (useDefaultNumber) setPhone('');
  };

  const handlePayment = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert(
        'Donation Initiated',
        `Your donation of XAF${amount} has been initiated.`,
        [{ text: 'OK' }]
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Make a Donation</Text>

          <Text style={styles.scripture}>
            "A generous person will prosper; whoever refreshes others will be refreshed." — Proverbs 11:25
          </Text>

          <TextInput
            placeholder="Name "
            value={nameOrCode}
            onChangeText={setNameOrCode}
            style={styles.input}
          />

          <TextInput
            placeholder="Amount (XAF)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {!useDefaultNumber && (
            <TextInput
              placeholder="Phone Number to withdraw with"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          )}

          <Pressable onPress={handleTogglePhone} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {useDefaultNumber
                ? 'Use another phone number'
                : 'Use signed-in phone number'}
            </Text>
          </Pressable>

          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
            <Pressable style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payText}>Donate Now</Text>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DonationPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB1A1A',
    marginTop: 20,
    fontFamily: 'sans-serif',
  },
  scripture: {
    color: '#FFD700',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'sans-serif',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'sans-serif',
  },
  toggleButton: {
    marginTop: -10,
  },
  toggleText: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },
  payButton: {
    marginTop: 20,
    backgroundColor: '#EB1A1A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
