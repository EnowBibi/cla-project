import { BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type PaymentItem = {
  _id: string;
  category: string;
  amount: number;
  createdAt: string;
};

const PaymentHistoryScreen = () => {
  const [history, setHistory] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/transactions/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch transactions.');

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Error loading history:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderItem: ListRenderItem<PaymentItem> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.category}</Text>
      <Text style={styles.amount}>XAF {item.amount.toLocaleString()}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#EB1A1A" style={{ marginTop: 50 }} />
      ) : history.length === 0 ? (
        <Text style={styles.emptyText}>You have no transactions yet.</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
