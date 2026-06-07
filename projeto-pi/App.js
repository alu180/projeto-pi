import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, usar_auten } from './contextos/auten_usuario';
import Pag_login from './paginas/Pag_login';
import Pag_cadastro from './paginas/Pag_cadastro';
import Pag_notificacoes from './paginas/Pag_notificacoes';
import Pag_biblioteca from './paginas/Pag_biblioteca';
import Pag_acervo from './paginas/Pag_acervo';
import Pag_sala_estudo from './paginas/Pag_sala_estudo';
import Pag_calendario from './paginas/Pag_calendario';
import Pag_horarios from './paginas/Pag_horarios';

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
          <>
            <Stack.Screen name="Login" component={Pag_login} />
            <Stack.Screen name="Cadastro" component={Pag_cadastro} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Pag_notificacoes} />
            <Stack.Screen name="Biblioteca" component={Pag_biblioteca} />
            <Stack.Screen name="Acervo" component={Pag_acervo} />
            <Stack.Screen name="SalaEstudo" component={Pag_sala_estudo} />
            <Stack.Screen name="Calendario" component={Pag_calendario} />
            <Stack.Screen name="Horarios" component={Pag_horarios} />
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