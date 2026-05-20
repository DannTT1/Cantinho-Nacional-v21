import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import HeaderGlobal from '../../configuration/header/HeaderGlobal'; // 👈 Seu caminho oficial mantido

export default function Cadastrar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarSenha = (s: string) => {
    return {
      tamanho: s.length >= 8,
      maiuscula: /[A-Z]/.test(s),
      minuscula: /[a-z]/.test(s),
      numero: /[0-9]/.test(s),
      especial: /[@$!%*?&]/.test(s),
    };
  };

  const regras = validarSenha(senha);

  const handleCadastro = async () => {
    const tudoCerto = Object.values(regras).every(v => v === true);

    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!tudoCerto) {
      Alert.alert("Senha Inválida", "A senha não atende aos requisitos de segurança.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup', { 
        name: nome.trim(), 
        email: email.trim().toLowerCase(), 
        password: senha 
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.replace('/(auth)/login') } 
      ]);
    } catch (error: any) {
      console.log("Erro:", error.response?.data);
      // Captura o IllegalArgumentException ("Este e-mail já está cadastrado no sistema.") do Spring Boot
      const msg = error.response?.data?.message || "Verifique se o e-mail já existe ou se há erro no servidor.";
      Alert.alert("Falha no Cadastro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <HeaderGlobal title="Criar Conta" showLogout={false} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Nova Conta</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Nome Completo" 
            placeholderTextColor="#666" 
            value={nome} 
            onChangeText={setNome} 
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            placeholderTextColor="#666" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor="#666" 
            value={senha} 
            onChangeText={setSenha} 
            secureTextEntry 
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Confirmar Senha" 
            placeholderTextColor="#666" 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
            secureTextEntry 
          />
        </View>

        <View style={styles.regrasBox}>
          <Text style={styles.regraTitle}>Requisitos da Senha:</Text>
          <Text style={[styles.regraText, regras.tamanho ? styles.ok : styles.erro]}>● No mínimo 8 caracteres</Text>
          <Text style={[styles.regraText, (regras.maiuscula && regras.minuscula) ? styles.ok : styles.erro]}>● Letras Maiúsculas e Minúsculas</Text>
          <Text style={[styles.regraText, regras.numero ? styles.ok : styles.erro]}>● Pelo menos um número</Text>
          <Text style={[styles.regraText, regras.especial ? styles.ok : styles.erro]}>● Caractere especial (@$!%*?&)</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>CRIAR CONTA</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: { 
    flexGrow: 1, 
    padding: 30, 
    paddingTop: 10,
    justifyContent: 'center' 
  },
  back: { 
    position: 'absolute', 
    top: 15, 
    left: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  inputContainer: { 
    backgroundColor: '#1A1A1A', 
    borderRadius: 12, 
    marginBottom: 15, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  input: { 
    height: 55, 
    color: '#fff' 
  },
  regrasBox: { 
    backgroundColor: '#1A1A1A', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20 
  },
  regraTitle: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  regraText: { 
    fontSize: 12, 
    marginBottom: 4 
  },
  ok: { 
    color: '#2ECC71' 
  },
  erro: { 
    color: '#E74C3C' 
  },
  button: { 
    backgroundColor: Colors.primary, 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#000'
  }
});