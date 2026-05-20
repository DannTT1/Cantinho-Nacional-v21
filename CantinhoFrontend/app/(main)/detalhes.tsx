import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import { imagensLocais } from '../../configuration/image/image';
import HeaderGlobal from '../../configuration/header/HeaderGlobal'; // 👈 Seu header oficial integrado

export default function Detalhes() {
  const livro = useLocalSearchParams(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAlugar = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      
      if (!userData) {
        Alert.alert(
          "Login Necessário",
          "Você precisa estar logado para reservar um livro.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Fazer Login", onPress: () => router.push('/(auth)/login') } 
          ]
        );
        return;
      }

      Alert.alert(
        "Forma de Pagamento",
        "O valor do aluguel é R$ 15,00. Como deseja pagar na retirada?",
        [
          { text: "Pix", onPress: () => processarAluguel() },
          { text: "Debito/Credito", onPress: () => processarAluguel() },
          { text: "Cancelar", style: "cancel" }
        ]
      );
    } catch (e) {
      console.error("Erro ao verificar login:", e);
      Alert.alert("Erro", "Ocorreu um problema ao verificar sua conta.");
    }
  };

  const processarAluguel = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('@user');
      const { token, id: userId } = JSON.parse(userData || '{}');

      await api.put(`/books/${livro.id}/rent`, userId, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "text/plain" }
      });

      Alert.alert(
        "Reserva Confirmada!",
        "📍 Retirada: Santo Amaro\nRua Bento Branco de Andrade Filho, 722.\n\nRetire em até 3 dias.",
        [{ text: "OK", onPress: () => router.push('/(main)/estante') }]
      );

    } catch (error: any) {
      const mensagemServidor = error.response?.data?.message || "";

      if (mensagemServidor.includes("suspensa") || mensagemServidor.includes("ajuda")) {
        Alert.alert(
          "Conta Bloqueada",
          "Sua conta possui pendências. Não foi possível realizar a reserva. Verifique a Central de Ajuda.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Ir para Ajuda", onPress: () => router.push('/(main)/ajuda') }
          ]
        );
      } else {
        Alert.alert("Atenção", mensagemServidor || "Conta bloqueada ou livro ja alugado");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!livro || !livro.title) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <HeaderGlobal title="Detalhes do Livro" showLogout={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={
              livro.coverUrl && String(livro.coverUrl).startsWith('http') 
                ? { uri: String(livro.coverUrl) } 
                : imagensLocais[
                    String(livro.title)
                      .toLowerCase()
                      .normalize("NFD")                   
                      .replace(/[\u0300-\u036f]/g, "")     
                      .replace(/-/g, " ")                  
                      .replace(/\s+/g, " ")                
                      .trim()
                  ] || { uri: 'https://via.placeholder.com/300' }
            } 
            style={styles.image} 
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{livro.title}</Text>
          <Text style={styles.author}>{livro.author}</Text>
          
          <View style={styles.priceBadge}>
            <Text style={styles.priceLabel}>Valor do Aluguel</Text>
            <Text style={styles.priceValue}>R$ 15,00</Text>
          </View>

          <Text style={styles.sectionTitle}>Sobre a Obra</Text>
          <Text style={styles.description}>
            {livro.description || "Esta obra de literatura nacional está disponível para reserva imediata."}
          </Text>

          <TouchableOpacity 
            style={[styles.rentButton, loading && { opacity: 0.7 }]} 
            onPress={handleAlugar} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.rentButtonText}>RESERVAR AGORA</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  container: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212' 
  },
  imageContainer: { 
    alignItems: 'center', 
    paddingTop: 30, 
    backgroundColor: '#1A1A1A', 
    paddingBottom: 40,
  },
  image: { 
    width: 220, 
    height: 330, 
    borderRadius: 15,
    resizeMode: 'cover',
  },
  infoContainer: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    backgroundColor: '#121212', 
    marginTop: -30, 
    minHeight: 450 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  author: { 
    fontSize: 18, 
    color: Colors.primary, 
    marginBottom: 20 
  },
  priceBadge: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1A1A1A', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 25 
  },
  priceLabel: { 
    color: '#aaa' 
  },
  priceValue: { 
    color: '#2ECC71', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 10 
  },
  description: { 
    color: '#ccc', 
    lineHeight: 22, 
    marginBottom: 30 
  },
  rentButton: { 
    backgroundColor: Colors.primary, 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 40 
  },
  rentButtonText: { 
    color: '#000', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});