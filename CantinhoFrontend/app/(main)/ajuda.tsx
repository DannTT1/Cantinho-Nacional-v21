import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../configuration/styles/theme';
import HeaderGlobal from '../../configuration/header/HeaderGlobal'; // 👈 Caminho oficial considerado

export default function AjudaScreen() {
  const [, setUserStatus] = useState('ACTIVE');

  useEffect(() => {
    const getStatus = async () => {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserStatus(user.status || 'ACTIVE'); 
      }
    };
    getStatus();
  }, []);

  const abrirWhatsApp = async () => {
    const url = 'https://wa.me/5511972981605?text=Olá! Preciso de ajuda com o Cantinho Nacional.';
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Erro", "WhatsApp não instalado.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HeaderGlobal configurado para esconder o botão de Sair nesta tela */}
      <HeaderGlobal title="Central de Ajuda" showLogout={false} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }} 
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Dúvidas Frequentes</Text>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Onde retiro o livro?</Text>
            <Text style={styles.faqAnswer}>Unidade Santo Amaro: Rua Bento Branco de Andrade Filho, 722.</Text>
          </View>

          <Text style={styles.sectionTitle}>Canais de Contato</Text>

          <TouchableOpacity style={styles.contactItem} onPress={abrirWhatsApp}>
            <Ionicons name="logo-whatsapp" size={24} color="#2ecc71" />
            <Text style={styles.contactText}>Suporte via WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => Linking.openURL('mailto:matheus.cardoso97@outlook.com')}
          >
            <Ionicons name="mail-outline" size={24} color={Colors.primary} />
            <Text style={styles.contactText}>E-mail de Suporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
  },
  scrollContent: { 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100 
  },
  content: { 
    flex: 1 
  },
  sectionTitle: { 
    color: Colors.primary, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 10 
  },
  faqCard: { 
    backgroundColor: '#1A1A1A', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  faqQuestion: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  faqAnswer: { 
    color: '#aaa', 
    fontSize: 14 
  },
  contactItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1A1A', 
    padding: 18, 
    borderRadius: 12, 
    marginTop: 12, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  contactText: { 
    color: '#fff', 
    marginLeft: 15, 
    fontWeight: '500' 
  }
});