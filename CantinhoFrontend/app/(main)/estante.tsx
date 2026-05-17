import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';

export default function Estante() {
  const [alugueis, setAlugueis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('@user');
      if (!userData) {
        setLoading(false);
        return;
      }
      const { id } = JSON.parse(userData);
      
      const res = await api.get(`/rentals/user/${id}/active`);
      setAlugueis(res.data); 
    } catch (e) {
      console.log("Erro ao carregar estante:", e);
      Alert.alert("Erro", "Não foi possível carregar seus livros.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => { loadRentals(); }, []);

  const handleCancel = (bookId: string) => {
    Alert.alert("Devolver Livro", "Deseja confirmar a devolução?", [
      { text: "Não", style: "cancel" },
      { 
        text: "Sim, Devolver", 
        onPress: async () => {
          try {
            const userData = await AsyncStorage.getItem('@user');
            const { id, token } = JSON.parse(userData || '{}');

            await api.put(`/books/${bookId}/cancel`, id, {
              headers: { 
                "Content-Type": "text/plain",
                "Authorization": `Bearer ${token}`
              }
            });

            Alert.alert("Sucesso", "Livro devolvido com sucesso!");
            loadRentals(); 
          } catch (err) {
            Alert.alert("Erro", "Não foi possível processar a devolução.");
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Minha Estante</Text>
      
      <FlatList
        data={alugueis}
        contentContainerStyle={{ paddingBottom: 120 }} 
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro alugado no momento.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>{item.bookTitle}</Text>
              <Text style={styles.info}>📍 Unidade: Santo Amaro, 722</Text>
              <Text style={[styles.info, { color: Colors.primary }]}>
                📅 Devolução: {new Date(item.returnDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleCancel(item.bookId)}>
              <Ionicons name="trash-outline" size={26} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
  card: { 
    backgroundColor: '#1A1A1A', 
    padding: 20, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  bookTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { color: '#aaa', fontSize: 12, marginTop: 5 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50 }
});