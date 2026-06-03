import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, usar_auten } from './contextos/auten_usuario';
import Pag_login         from './paginas/Pag_login';
import Pag_notificacoes  from './paginas/Pag_notificacoes';
import Pag_biblioteca    from './paginas/Pag_biblioteca';
import Pag_sala_estudo   from './paginas/Pag_sala_estudo';
import Pag_calendario    from './paginas/Pag_calendario';
import Pag_horarios      from './paginas/Pag_horarios';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = usar_auten();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#5F8F9D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Usuário não autenticado → só vê Login
          <Stack.Screen name="Login" component={Pag_login} />
        ) : (
          // Usuário autenticado → fluxo principal
          <>
            <Stack.Screen name="Home"       component={Pag_notificacoes} />
            <Stack.Screen name="Biblioteca" component={Pag_biblioteca} />
            <Stack.Screen name="SalaEstudo" component={Pag_sala_estudo} />
            <Stack.Screen name="Calendario" component={Pag_calendario} />
            <Stack.Screen name="Horarios"   component={Pag_horarios} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});







/*import { AuthProvider, usar_auten } from './contextos/auten_usuario';
import Pag_login from './paginas/Pag_login';
import { Button, StyleSheet, Text, View } from 'react-native';

// Componente que decide qual tela renderizar com base no estado de autenticação
function AppContent() {
  const { user, loading, logout } = usar_auten();

  if (loading) {
    // Enquanto verifica se tem um usuário salvo, mostra um indicador de carregamento
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (user) {
    // Tela simples após login com botão de sair
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo, {user}!</Text>
        <Button title="Sair" onPress={logout} />
      </View>
    );
  }

  // Caso não esteja autenticado, mostra a tela de login
  return <Pag_login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});*/