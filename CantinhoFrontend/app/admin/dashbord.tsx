import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resStats, resBooks] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/books')
      ]);
      setStats(resStats.data);
      setLivros(resBooks.data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={async () => { await AsyncStorage.removeItem('@user'); router.replace('/login'); }}>
          <Ionicons name="log-out-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestão Cantinho</Text>
        <TouchableOpacity onPress={() => router.push('/admin/novolivro')}>
          <Ionicons name="add-circle" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/usuarios')}>
            <Ionicons name="people" size={24} color={Colors.primary} />
            <Text style={styles.menuText}>Usuários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={carregarDados}>
            <Ionicons name="sync" size={24} color={Colors.primary} />
            <Text style={styles.menuText}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Faturamento</Text>
            <Text style={styles.statValue}>R$ {stats?.totalRevenue?.toFixed(2) || "0,00"}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Emprestados</Text>
            <Text style={styles.statValue}>{stats?.rentedBooks || 0} un</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Inventário Atual</Text>
        
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 20 }} />
        ) : (
          livros.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.bookCard} 
              onPress={() => router.push({ pathname: '/admin/editar', params: { id: item.id } })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
              </View>
              <Text style={[styles.stockText, { color: item.quantity < 2 ? Colors.error : '#2ecc71' }]}>
                {item.quantity} un
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A' },
  headerTitle: { color: Colors.primary, fontSize: 20, fontWeight: 'bold' },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  menuItem: { backgroundColor: '#1A1A1A', width: '48%', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  menuText: { color: '#fff', marginTop: 5, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#1A1A1A', width: '48%', padding: 15, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  statLabel: { color: '#666', fontSize: 10, textTransform: 'uppercase' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { color: '#666', marginBottom: 15, textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' },
  bookCard: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  bookTitle: { color: '#fff', fontWeight: 'bold' },
  bookAuthor: { color: '#666', fontSize: 12 },
  stockText: { fontWeight: 'bold' }
});