import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Aviso", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { 
        email: email, 
        password: senha 
      });

      await AsyncStorage.setItem('@user', JSON.stringify(response.data));

      if (response.data.role === 'ROLE_ADMIN') {
        router.replace('/admin/dashbord');
      } else {
        router.replace('/(main)/index-home');
      }
    } catch (error: any) {
      Alert.alert("Erro", "Credenciais inválidas ou usuário bloqueado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="library" size={70} color={Colors.primary} />
        <Text style={styles.title}>Cantinho Nacional</Text>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="E-mail" 
          placeholderTextColor="#666" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          placeholderTextColor="#666" 
          value={senha} 
          onChangeText={setSenha}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
      </TouchableOpacity>

      {/* Rota corrigida para Visitante (de tabs para main) */}
      <TouchableOpacity style={styles.guestButton} onPress={() => router.replace('/(main)/index-home')}>
        <Text style={styles.guestText}>Continuar como Visitante</Text>
      </TouchableOpacity>

      {/* Rota de cadastro corrigida para incluir a pasta (auth) */}
      <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/cadastrar')}>
        <Text style={styles.linkText}>Não tem conta? <Text style={{color: Colors.primary}}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginTop: 10 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1A1A', 
    borderRadius: 12, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#fff' },
  button: { backgroundColor: Colors.primary, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  guestButton: { marginTop: 20, padding: 10, alignItems: 'center' },
  guestText: { color: '#aaa', fontSize: 14, textDecorationLine: 'underline' },
  link: { marginTop: 30, alignItems: 'center' },
  linkText: { color: '#ccc' }
});