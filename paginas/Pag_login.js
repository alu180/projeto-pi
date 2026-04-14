import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import User_login from '../hooks/User_login';

const Pag_login = ({ onLoginSuccess }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    login,
  } = User_login();

  const handleLogin = async () => {
    try {
      const result = await login();
      // Se o login for bem-sucedido notifica o componente superior
      if (result && onLoginSuccess) {
        onLoginSuccess(result);
      }
    } catch (err) {
      // O erro e tratado no hook mas agnt pode exibir um alerta pro o usuário
      Alert.alert('Falha no login', error);
    }
  };

  return (<View style={styles.container}>
      {/* Logo / Título */}
      <View style={styles.header}>
        <Text style={styles.logo}>Sinapse</Text>
        <Text style={styles.subtitle}>
          acessibilidade para a sua faculdade
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Usuário:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Digite sua senha"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>entrar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.forgot}>esqueceu sua senha?</Text>
      </View>
    </View>
  );
};

export default Pag_login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5F8F9D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#dfeff2',
    marginTop: 5,
    fontSize: 12,
  },

  card: {
    width: '85%',
    backgroundColor: '#EAEAEA',
    borderRadius: 25,
    padding: 20,
  },

  label: {
    marginTop: 10,
    color: '#3c6e71',
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#D3D3D3',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },

  button: {
    backgroundColor: '#6DAA7F',
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  forgot: {
    textAlign: 'center',
    marginTop: 15,
    color: '#3c6e71',
  },

  error: {
    color: 'red',
    marginTop: 10,
  },
});