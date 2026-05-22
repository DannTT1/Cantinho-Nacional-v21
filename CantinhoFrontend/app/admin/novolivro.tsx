import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import HeaderGlobal from '../../configuration/header/HeaderGlobal'; // 👈 Seu caminho oficial considerado

export default function NovoLivroAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    quantity: '1', 
    coverUrl: '',
    country: 'Brasil' 
  });

  const salvarNovo = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o Título e o Autor.");
      return;
    }

    // FILTRO DE NACIONALIDADE ATIVADO:
    const paisLimpo = form.country.trim().toLowerCase();
    if (paisLimpo !== 'brasil' && paisLimpo !== 'brasileiro' && paisLimpo !== 'brasileira') {
      Alert.alert(
        "Obra Recusada", 
        "Este aplicativo é exclusivo para o acervo de literatura e obras nacionais. Não é permitido cadastrar livros estrangeiros."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        ...form, 
        quantity: parseInt(form.quantity) || 0 
      };

      await api.post('/admin/books', payload); 
      Alert.alert("Sucesso", "O livro foi adicionado ao acervo com sucesso!");
      router.replace('/admin/dashbord'); 
      
    } catch (e: any) {
      console.error("Erro ao cadastrar:", e.response?.data);
      const erroServidor = e.response?.data?.message || "Não foi possível salvar o livro.";
      Alert.alert("Erro no Cadastro", erroServidor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: '#121212' }}
    >
      <HeaderGlobal title="Novo Produto" showLogout={false} />

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.actionHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color={Colors.primary} />
            <Text style={styles.backText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>TÍTULO DA OBRA</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Dom Casmurro" 
            placeholderTextColor="#666" 
            value={form.title}
            onChangeText={(v) => setForm({ ...form, title: v })} 
          />

          <Text style={styles.label}>AUTOR</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Machado de Assis" 
            placeholderTextColor="#666" 
            value={form.author}
            onChangeText={(v) => setForm({ ...form, author: v })} 
          />

          <Text style={styles.label}>PAÍS DE ORIGEM</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Brasil" 
            placeholderTextColor="#666" 
            value={form.country}
            onChangeText={(v) => setForm({ ...form, country: v })} 
          />

          <Text style={styles.label}>DESCRIÇÃO / SINOPSE</Text>
          <TextInput 
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]} 
            multiline 
            numberOfLines={5}
            placeholder="Escreva um breve resumo da obra para o cliente..." 
            placeholderTextColor="#666" 
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })} 
          />

          <Text style={styles.label}>CAPA (LINK OU NOME DO ARQUIVO)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="http://imagem-da-capa.jpg" 
            placeholderTextColor="#666" 
            value={form.coverUrl}
            onChangeText={(v) => setForm({ ...form, coverUrl: v })} 
            autoCapitalize="none"
          />

          <Text style={styles.label}>ESTOQUE DISPONÍVEL</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            placeholder="1" 
            placeholderTextColor="#666" 
            value={form.quantity}
            onChangeText={(v) => setForm({ ...form, quantity: v })} 
          />

          <TouchableOpacity 
            style={[styles.btnSalvar, loading && { opacity: 0.7 }]} 
            onPress={salvarNovo} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={styles.btnText}>CADASTRAR NO ACERVO</Text>
            )}
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  actionHeader: { paddingHorizontal: 20, paddingTop: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#fff', marginLeft: 8, fontWeight: '500', fontSize: 16 },
  form: { padding: 20 },
  label: { color: Colors.primary, marginBottom: 8, fontWeight: 'bold', fontSize: 11, letterSpacing: 1 },
  input: { backgroundColor: '#1A1A1A', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  btnSalvar: { backgroundColor: Colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  btnText: { fontWeight: 'bold', color: '#1a1a1a', fontSize: 16 }
});