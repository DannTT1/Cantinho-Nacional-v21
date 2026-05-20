import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import { imagensLocais } from '../../configuration/image/image'; 
import HeaderGlobal from '../../configuration/header/HeaderGlobal';

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

      const nomesDestaques = ["dom casmurro", "memorias de bras cubas", "grande sertao de varedas", "quincas borba"];
      
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

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} size="large" /></View>;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      <HeaderGlobal title={`Olá, ${nomeUsuario}!`} showLogout={true} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.subGreeting}>O que vamos ler hoje?</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 5,
  },
  subGreeting: { 
    fontSize: 16, 
    color: '#aaa',
    fontWeight: '500'
  },
  section: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20 
  },
  card: { 
    marginRight: 20, 
    width: 140, 
  },
  image: { 
    width: 140, 
    height: 210, 
    borderRadius: 12,
    resizeMode: 'cover', 
  },
  bookTitle: { 
    color: '#fff', 
    marginTop: 10, 
    fontWeight: 'bold',
    fontSize: 14 
  },
  price: { 
    color: Colors.primary, 
    fontSize: 14, 
    fontWeight: 'bold',
    marginTop: 2
  }
});