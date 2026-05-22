import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import HeaderGlobal from '../../configuration/header/HeaderGlobal'; // 👈 Seu caminho oficial considerado

export default function EditarLivroAdmin() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    quantity: '0', 
    coverUrl: '',
    country: 'Brasil' // Inicia o estado mapeado
  });

  const getCleanId = () => {
    if (!id) return '';
    const rawId = Array.isArray(id) ? id[0] : id;
    return String(rawId).replace(/[\\"]/g, '').trim();
  };

  useEffect(() => {
    const cleanId = getCleanId();
    if (cleanId) {
      setLoading(true);
      api.get(`/admin/books/${cleanId}`) 
        .then(res => {
          setForm({
            title: res.data.title || '',
            author: res.data.author || '',
            description: res.data.description || '',
            quantity: String(res.data.quantity || 0),
            coverUrl: res.data.coverUrl || '',
            country: res.data.country || 'Brasil' // Sincroniza o país retornado pela API
          });
        })
        .catch(err => {
          console.error("Erro ao carregar dados:", err.response?.status || err.message);
          Alert.alert("Erro", "Não foi possível carregar os dados para edição.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const excluirLivro = () => {
    const cleanId = getCleanId();
    Alert.alert("Excluir", "Deseja remover este livro permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          try {
            await api.delete(`/admin/books/${cleanId}`);
            router.replace('/admin/dashbord');
          } catch (e) {
            Alert.alert("Erro", "Falha ao excluir livro.");
          }
      }}
    ]);
  };

  const salvarAlteracoes = async () => {
    const cleanId = getCleanId();
    if (!form.title.trim() || !form.author.trim()) {
      Alert.alert("Erro", "Título e Autor são obrigatórios.");
      return;
    }

    // FILTRO DE VALIDAÇÃO DE NACIONALIDADE:
    const paisLimpo = form.country.trim().toLowerCase();
    if (paisLimpo !== 'brasil' && paisLimpo !== 'brasileiro' && paisLimpo !== 'brasileira') {
      Alert.alert(
        "Obra Recusada", 
        "Este aplicativo aceita apenas obras nacionais. Não é permitido alterar a nacionalidade do livro para um país estrangeiro."
      );
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        ...form, 
        title: form.title.trim(),
        author: form.author.trim(),
        quantity: parseInt(form.quantity) || 0 
      };

      await api.put(`/admin/books/${cleanId}`, payload);
      Alert.alert("Sucesso", "Dados updated com sucesso!");
      router.replace('/admin/dashbord');
    } catch (e: any) {
      console.log("Erro no PUT:", e.response?.data || e.message);
      const erroServidor = e.response?.data?.message || "Não foi possível salvar as alterações.";
      Alert.alert("Erro", erroServidor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: '#121212' }}
    >
      <HeaderGlobal title="Editar Obra" showLogout={false} />

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.actionHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={excluirLivro} style={styles.trashIcon}>
            <Ionicons name="trash-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {loading && !form.title ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>TÍTULO</Text>
            <TextInput 
              style={styles.input} 
              value={form.title} 
              onChangeText={(v) => setForm({ ...form, title: v })} 
            />

            <Text style={styles.label}>AUTOR</Text>
            <TextInput 
              style={styles.input} 
              value={form.author} 
              onChangeText={(v) => setForm({ ...form, author: v })} 
            />

            <Text style={styles.label}>PAÍS DE ORIGEM</Text>
            <TextInput 
              style={styles.input} 
              value={form.country} 
              onChangeText={(v) => setForm({ ...form, country: v })} 
            />

            <Text style={styles.label}>DESCRIÇÃO DA OBRA</Text>
            <TextInput 
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]} 
              multiline 
              value={form.description} 
              onChangeText={(v) => setForm({ ...form, description: v })} 
              placeholder="Resumo do livro..."
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>URL DA IMAGEM OU NOME DO ASSET</Text>
            <TextInput 
              style={styles.input} 
              value={form.coverUrl} 
              onChangeText={(v) => setForm({ ...form, coverUrl: v })} 
              autoCapitalize="none"
            />

            <Text style={styles.label}>QUANTIDADE EM ESTOQUE</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={form.quantity} 
              onChangeText={(v) => setForm({ ...form, quantity: v })} 
            />

            <TouchableOpacity 
              style={[styles.btnSalvar, loading && { opacity: 0.7 }]} 
              onPress={salvarAlteracoes} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <Text style={styles.btnText}>SALVAR ALTERAÇÕES</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#fff', marginLeft: 8, fontWeight: '500', fontSize: 16 },
  trashIcon: { padding: 4 },
  form: { padding: 20 },
  label: { color: Colors.primary, marginBottom: 8, fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
  input: { backgroundColor: '#1A1A1A', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  btnSalvar: { backgroundColor: Colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 3 },
  btnText: { fontWeight: 'bold', color: '#1a1a1a', fontSize: 16 }
});