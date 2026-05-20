import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../styles/theme'; // Ajuste o caminho se necessário

interface HeaderGlobalProps {
  title: string;
  showLogout?: boolean; // Controla se o botão de sair deve aparecer
}

export default function HeaderGlobal({ title, showLogout = true }: HeaderGlobalProps) {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar sua sessão?", [
      { text: "Não", style: "cancel" },
      { 
        text: "Sim", 
        onPress: async () => {
          await AsyncStorage.removeItem('@user');
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        <Ionicons name="book" size={24} color={Colors.primary} style={styles.bookIcon} />
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Joga o título para a esquerda e o botão para a direita
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  bookIcon: {
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  logoutButton: {
    padding: 6,
  },
});