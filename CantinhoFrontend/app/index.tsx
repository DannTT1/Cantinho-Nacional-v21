import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../configuration/styles/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const inicializarApp = async () => {
      try {
     
        await AsyncStorage.removeItem('@user');
        // LOGICA PARA REMOÇÃO DE USUARIO LOGADO
router.replace('/(auth)/login');      } catch (e) {
        console.error("Erro ao resetar app:", e);
router.replace('/(auth)/login');      }
    };

    inicializarApp();
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