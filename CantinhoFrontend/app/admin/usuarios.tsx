import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importar o router
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 
  const carregar = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      Alert.alert("Erro", "Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const toggleStatus = (user: any) => {
    const acao = user.status === 'ACTIVE' ? 'BLOQUEAR' : 'ATIVAR';
    Alert.alert(acao, `Deseja alterar o status de ${user.userName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: async () => {
          try {
            await api.put(`/admin/users/${user.userId}/unlock`);
            carregar();
          } catch (err) {
            Alert.alert("Erro", "Não foi possível alterar o status.");
          }
      }}
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Usuários e Débitos</Text>
        
        <View style={{ width: 24 }} /> 
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={{ color: item.booksPending > 0 ? '#ff4d4d' : '#2ecc71', fontSize: 13, marginTop: 4 }}>
                Pendências: {item.booksPending} livros • R$ {item.totalDebt.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.statusBtn, 
                { borderColor: item.status === 'ACTIVE' ? '#2ecc71' : '#ff4d4d' }
              ]} 
              onPress={() => toggleStatus(item)}
            >
              <Text style={{ 
                color: item.status === 'ACTIVE' ? '#2ecc71' : '#ff4d4d', 
                fontWeight: 'bold',
                fontSize: 12
              }}>
                {item.status}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  backButton: {
    padding: 4,
  },
  headerTitle: { 
    color: Colors.primary, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  userCard: { 
    backgroundColor: '#1A1A1A', 
    padding: 18, 
    borderRadius: 12, 
    marginHorizontal: 15,
    marginTop: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  statusBtn: { 
    borderWidth: 1, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 8 
  }
});