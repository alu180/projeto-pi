import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User_login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função de validacao do login
  const validacao = () => {
    if (!username.trim()) {
      setError('Usuário é obrigatório');
      return false;
    }
    if (!password.trim()) {
      setError('Senha é obrigatória');
      return false;
    }
    return true;
  };

  // Função do login chamada api temporaria
  const login = async () => {
    if (!validacao()) return;

    setLoading(true);
    setError(null);

    try {
      // Simula requisicao a API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ token: 'apiaqui.com', user: username });
        }, 1000);
      });

      // Salva token e dados do usuário
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      return response; // Retorna os dados para o componente usar
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout (limpa o storage)
  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    login,
    logout,
  };
};

export default User_login;