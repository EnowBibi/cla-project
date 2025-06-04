import React from 'react';
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Define the type for each payment history item
type PaymentItem = {
  id: string;
  type: string;
  amount: string;
  date: string;
};

const mockHistory: PaymentItem[] = [
  { id: '1', type: 'Tithe', amount: '5,000', date: '2025-06-01' },
  { id: '2', type: 'Offering', amount: '2,000', date: '2025-05-28' },
  { id: '3', type: 'Donation', amount: '10,000', date: '2025-05-20' },
  { id: '4', type: 'Special Seed', amount: '15,000', date: '2025-05-15' },
];

const PaymentHistoryScreen = () => {
  const renderItem: ListRenderItem<PaymentItem> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.amount}>XAF {item.amount}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default PaymentHistoryScreen;

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
  list: {
    gap: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  type: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EB1A1A',
    marginBottom: 5,
    fontFamily: 'sans-serif-medium',
  },
  amount: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'sans-serif',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    fontFamily: 'sans-serif-light',
  },
});
