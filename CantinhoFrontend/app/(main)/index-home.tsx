import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, Image,TouchableOpacity, Alert, ActivityIndicator, StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import { imagensLocais } from '../../configuration/image/image'; 

export default function Home() {
  const [nomeUsuario, setNomeUsuario] = useState('Visitante');
  const [destaques, setDestaques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      setNomeUsuario(userData ? JSON.parse(userData).name : 'Visitante');

      const res = await api.get('/books');

      const nomesDestaques = ["dom casmurro", "memorias de bras cubas", "grande sertao de varedas","quincas borba"];
      
      const filtrados = res.data.filter((livro: any) => {
        const tituloLimpo = livro.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") 
          .trim();
        
        return nomesDestaques.some(destaque => 
          tituloLimpo.includes(destaque.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        );
      });

      setDestaques(filtrados.length > 0 ? filtrados : res.data.slice(0, 4));
      
    } catch (error) {
      console.error("Erro ao carregar Home:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Encerrar sessão?", [
      { text: "Não" },
      { text: "Sim", onPress: async () => {
          await AsyncStorage.removeItem('@user');
          router.replace('/(auth)/login');
      }}
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} size="large" /></View>;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {nomeUsuario}!</Text>
          <Text style={styles.subGreeting}>O que vamos ler hoje?</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destaques Clássicos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {destaques.map((livro) => (
            <TouchableOpacity 
              key={livro.id} 
              style={styles.card}
              onPress={() => router.push({ 
                pathname: "/(main)/detalhes", 
                params: { ...livro } 
              })}
            >
              <Image 
                source={
                  livro.coverUrl && livro.coverUrl.startsWith('http') 
                    ? { uri: livro.coverUrl } 
                    : imagensLocais[livro.title.toLowerCase().trim()] || { uri: 'https://via.placeholder.com/150' }
                } 
                style={styles.image} 
              />
              <Text style={styles.bookTitle} numberOfLines={1}>{livro.title}</Text>
              <Text style={styles.price}>R$ 15,00</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 50 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  subGreeting: { fontSize: 16, color: '#aaa' },
  logoutButton: { backgroundColor: '#1A1A1A', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  card: { marginRight: 20, width: 160 },
  image: { width: 160, height: 240, borderRadius: 12 },
  bookTitle: { color: '#fff', marginTop: 10, fontWeight: 'bold' },
  price: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' }
});