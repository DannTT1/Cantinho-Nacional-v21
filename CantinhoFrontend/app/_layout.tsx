import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// logica de caminhos possiveis das telas utilizando o expo-router importado,
//  abaixo estao as telas definidas dentro de stackscreem.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)/login" /> 
        <Stack.Screen name="(auth)/cadastrar" /> 
        <Stack.Screen name="(main)" />
        <Stack.Screen name="admin/dashbord" /> 
        <Stack.Screen name="admin/editar" /> 
        <Stack.Screen name="admin/usuarios" />
        <Stack.Screen name="admin/novolivro" />
      </Stack>
    </>
  );
}