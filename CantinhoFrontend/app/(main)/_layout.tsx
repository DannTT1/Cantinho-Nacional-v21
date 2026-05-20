import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../configuration/styles/theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      {/* O SafeAreaView cria um escudo na parte inferior ('bottom') impedindo os botões do Android de cobrirem os ícones do app */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1A1A' }} edges={['bottom']}>
        <Tabs screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.primary, 
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333',
            height: 65,
            paddingBottom: 10,
            borderTopWidth: 1,
          },
          headerShown: false,
        }}>
          <Tabs.Screen
            name="index-home"
            options={{
              title: 'Início',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explorar"
            options={{
              title: 'Explorar',
              tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="estante"
            options={{
              title: 'Minha Estante',
              tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="detalhes"
            options={{
              href: null, 
            }}
          />
          <Tabs.Screen
            name="ajuda"
            options={{
              title: 'Ajuda',
              tabBarIcon: ({ color }) => <Ionicons name="help-circle" size={24} color={color} />,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}