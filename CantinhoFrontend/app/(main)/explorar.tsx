import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../configuration/api/api';
import { Colors } from '../../configuration/styles/theme';
import { imagensLocais } from '../../configuration/image/image';



export default function Explorar() {
  const [livros, setLivros] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchLivros(); }, []);

  const fetchLivros = async () => {
    try {
      setLoading(true);
      const res = await api.get('/books');
      setLivros(res.data);
    } catch (e) {
      console.log("Erro ao buscar acervo:", e);
    } finally {
      setLoading(false);
    }
  };

  const livrosFiltrados = livros.filter(l => 
    l.title.toLowerCase().includes(filtro.toLowerCase()) ||
    l.author.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar Acervo</Text>
      
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Título ou autor..."
          placeholderTextColor="#666"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={livrosFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({ pathname: "/(main)/detalhes", params: { ...item } })}
            >
              <View style={styles.imageWrapper}>
                <Image 
                  source={
                    item.coverUrl && item.coverUrl.startsWith('http') 
                      ? { uri: item.coverUrl } 
                      : imagensLocais[item.title.toLowerCase().trim()] || { uri: 'https://via.placeholder.com/300' }
                  } 
                  style={styles.image} 
                />
              </View>
              <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
              <Text style={styles.price}>R$ 15,00</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 15, height: 50, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, color: '#fff', marginLeft: 10 },
  row: { justifyContent: 'space-between' },
  card: { width: '47%', marginBottom: 25 },
  imageWrapper: { width: '100%', height: 220, borderRadius: 10, overflow: 'hidden', backgroundColor: '#1A1A1A' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  bookTitle: { color: '#fff', fontWeight: 'bold', marginTop: 10, fontSize: 14 },
  author: { color: '#888', fontSize: 12 },
  price: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' }
});