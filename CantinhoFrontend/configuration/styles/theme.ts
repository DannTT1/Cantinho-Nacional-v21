import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#EAB308',   
  background: '#121212',
  surface: '#1A1A1A',   
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  error: '#E74C3C',
  success: '#2ECC71',
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
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
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  }
});