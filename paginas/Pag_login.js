import { Alert, View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import User_login from '../hooks/User_login';
import { usar_auten } from '../contextos/auten_usuario';

const Pag_login = () => {
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
  const { login } = usar_auten();

  const handleLogin = async () => {
    const formData = getFormData();
    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      const mensagem = err?.message || 'Não foi possível entrar.';
      setError(mensagem);
      Alert.alert('Falha no login', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo / Título */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <View style={styles.brandLeft}>
              <View style={styles.brandCircleLarge} />
              <View style={styles.brandCircleSmall} />
            </View>
            <View style={styles.brandRight}>
              <View style={styles.brandLineTop}>
                <View style={styles.brandDot} />
              </View>
              <View style={styles.brandLineMiddle} />
              <View style={styles.brandLineBottom} />
            </View>
          </View>
          <Text style={styles.logo}>Sinapse</Text>
        </View>
        <Text style={styles.subtitle}>acessibilidade para a sua faculdade</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Ionicons name="person-outline" size={22} color="#6F6F6F" />
          <Text style={styles.label}>Usuário:</Text>
        </View>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
        />

        <View style={styles.labelRow}>
          <Ionicons name="lock-closed-outline" size={22} color="#6F6F6F" />
          <Text style={styles.label}>Senha:</Text>
        </View>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 42,
    height: 34,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  brandLeft: {
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRight: {
    height: 18,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brandCircleLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  brandCircleSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  brandLineTop: {
    width: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  brandLineMiddle: {
    width: 11,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFF',
  },
  brandLineBottom: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFF',
  },
  logo: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#DFEFF2',
    marginTop: 5,
    fontSize: 12,
  },
  card: {
    width: '85%',
    backgroundColor: '#EAEAEA',
    borderRadius: 25,
    padding: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  label: {
    color: '#3C6E71',
    fontWeight: 'bold',
    fontSize: 22,
  },
  input: {
    backgroundColor: '#D3D3D3',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    marginLeft: 32,
  },
  button: {
    backgroundColor: '#6DAA7F',
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgot: {
    textAlign: 'center',
    marginTop: 15,
    color: '#3C6E71',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});