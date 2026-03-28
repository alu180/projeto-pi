// src/screens/Pag_login.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import User_login from '../hooks/User_login';
import { usar_auten } from '../contextos/auten_usuario';

const Pag_login = () => {
  const { login: autenlogin } = usar_auten();  // função de login do contexto
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    setLoading,
    error,
    setError,
    getFormData,
  } = User_login();

  const handleLogin = async () => {
    const formData = getFormData();  // valida e retorna { username, password }
    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      await autenlogin(formData.username, formData.password);
      // Se chegou aqui, login bem-sucedido. O App redirecionará automaticamente.
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6092A7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Pag_login;