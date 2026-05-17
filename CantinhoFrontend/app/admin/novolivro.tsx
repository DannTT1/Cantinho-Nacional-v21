import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView,  Alert,ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';

export default function NovoLivroAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    quantity: '1', 
    coverUrl: '' 
  });

  const salvarNovo = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o Título e o Autor.");
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
      Alert.alert("Erro no Cadastro", "Não foi possível salvar o livro. Verifique a conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Produto</Text>
          <View style={{ width: 28 }} /> 
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
  header: { 
    padding: 25, 
    paddingTop: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { color: Colors.primary, marginBottom: 8, fontWeight: 'bold', fontSize: 11, letterSpacing: 1 },
  input: { 
    backgroundColor: '#1A1A1A', 
    color: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  btnSalvar: { 
    backgroundColor: Colors.primary, 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  btnText: { fontWeight: 'bold', color: '#1a1a1a', fontSize: 16 }
});