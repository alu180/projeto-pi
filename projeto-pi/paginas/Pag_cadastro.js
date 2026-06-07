import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { CORES } from '../components/cores';
import { usar_auten } from '../contextos/auten_usuario';

const Pag_cadastro = ({ navigation }) => {
  const { login } = usar_auten();

  // Estados dos campos
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [instituicao, setInstituicao] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  // Validação local antes de mandar pro backend
  const validarFormulario = () => {
    if (!username.trim() || !password.trim() || !nome.trim()) {
      setErro('Usuário, senha e nome são obrigatórios');
      return false;
    }
    if (username.length < 3) {
      setErro('Usuário deve ter pelo menos 3 caracteres');
      return false;
    }
    if (password.length < 4) {
      setErro('Senha deve ter pelo menos 4 caracteres');
      return false;
    }
    if (password !== confirmarSenha) {
      setErro('Senhas não coincidem');
      return false;
    }
    return true;
  };

  const handleCadastrar = async () => {
    setErro(null);
    if (!validarFormulario()) return;

    try {
      setEnviando(true);

      // 1. Cria a conta no backend
      await api.post('/usuarios', {
        username: username.trim(),
        password,
        nome: nome.trim(),
        matricula: matricula.trim(),
        curso: curso.trim(),
        instituicao: instituicao.trim(),
      });

      // 2. Faz login automático com as credenciais recém-criadas.
      //    Isso popula o contexto de autenticação com os dados do novo usuário,
      //    e o AppNavigator troca pras telas logadas automaticamente.
      //    O Header lê do contexto e exibe os dados da nova conta.
      await login(username.trim(), password);
      // (Daqui pra frente o componente desmonta — a tela Home assume.)
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.message ||
        'Não foi possível criar a conta. Verifique sua conexão.';
      setErro(msg);
      Alert.alert('Falha no cadastro', msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Sinapse</Text>
          <Text style={styles.subtitle}>criar nova conta</Text>
        </View>

        {/* Card do formulário */}
        <View style={styles.card}>
          {/* Nome */}
          <View style={styles.labelRow}>
            <Ionicons name="person-circle-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Nome completo*</Text>
          </View>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            editable={!enviando}
          />

          {/* Usuário */}
          <View style={styles.labelRow}>
            <Ionicons name="person-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Usuário*</Text>
          </View>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Pelo menos 3 caracteres"
            autoCapitalize="none"
            editable={!enviando}
          />

          {/* Senha */}
          <View style={styles.labelRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Senha*</Text>
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Pelo menos 4 caracteres"
            secureTextEntry
            editable={!enviando}
          />

          {/* Confirmar senha */}
          <View style={styles.labelRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Confirmar senha*</Text>
          </View>
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Digite a senha novamente"
            secureTextEntry
            editable={!enviando}
          />

          {/* Matrícula */}
          <View style={styles.labelRow}>
            <Ionicons name="card-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Matrícula</Text>
          </View>
          <TextInput
            style={styles.input}
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Ex: 202312345"
            keyboardType="numeric"
            editable={!enviando}
          />

          {/* Curso */}
          <View style={styles.labelRow}>
            <Ionicons name="school-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Curso</Text>
          </View>
          <TextInput
            style={styles.input}
            value={curso}
            onChangeText={setCurso}
            placeholder="Ex: Ciência da Computação"
            editable={!enviando}
          />

          {/* Instituição */}
          <View style={styles.labelRow}>
            <Ionicons name="business-outline" size={20} color="#6F6F6F" />
            <Text style={styles.label}>Instituição</Text>
          </View>
          <TextInput
            style={styles.input}
            value={instituicao}
            onChangeText={setInstituicao}
            placeholder="Ex: IESB"
            editable={!enviando}
          />

          {/* Mensagem de erro */}
          {erro ? <Text style={styles.error}>{erro}</Text> : null}

          {/* Botão de cadastrar */}
          {enviando ? (
            <ActivityIndicator size="large" color={CORES.verde} style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
              <Text style={styles.buttonText}>criar conta</Text>
            </TouchableOpacity>
          )}

          {/* Link pra voltar pro login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={enviando}
          >
            <Text style={styles.linkLogin}>Já tem uma conta? Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Pag_cadastro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5F8F9D',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    width: '88%',
    backgroundColor: '#EAEAEA',
    borderRadius: 25,
    padding: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  label: {
    color: '#3C6E71',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    marginLeft: 28,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#6DAA7F',
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkLogin: {
    textAlign: 'center',
    marginTop: 15,
    color: '#3C6E71',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});