import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../configuration/styles/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user');
        
        if (userData) {
          const user = JSON.parse(userData);
          // Verifica se o perfil do cara salvo na memória é administrador ou comum
          if (user.role === 'ROLE_ADMIN') {
            router.replace('/admin/dashbord');
          } else {
            router.replace('/(main)/index-home');
          }
        } else {
          // Se não tiver dado salvo, manda fazer login
          router.replace('/(auth)/login');
        }
      } catch (e) {
        console.error("Erro ao inicializar app:", e);
        router.replace('/(auth)/login');
      }
    };

    verificarSessao();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212' 
  },
});