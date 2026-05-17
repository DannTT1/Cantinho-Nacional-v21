import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#EAB308',   // O dourado do seu app
  background: '#121212',
  surface: '#1A1A1A',   // Cinza escuro para cards e inputs
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  error: '#E74C3C',
  success: '#2ECC71',
};

export const GlobalStyles = StyleSheet.create({
  // Estilo padrão para as telas
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  // Estilo para títulos grandes
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  // Estilo para botões dourados
  buttonPrimary: {
    backgroundColor: Colors.primary,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  // Estilo para inputs padronizados
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  }
});