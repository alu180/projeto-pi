import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; 

const auten_usuario = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário salvo ao iniciar
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (username, password) => {
    try {
      // Chamada real ao backend
      const resposta = await api.post('/login', { username, password });

      const { token, user: usuarioRetornado } = resposta.data;

      // Persistir token e dados no AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(usuarioRetornado));

      // Atualizar estado global
      setUser(usuarioRetornado);

      return resposta.data;
    } catch (error) {
      // Traduz erros do axios em mensagens amigáveis
      if (error.response) {
        // Backend respondeu com erro (ex: 401)
        const msg = error.response.data?.erro || 'Erro no login';
        throw new Error(msg);
      } else if (error.request) {
        // Não conseguiu falar com o backend
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        throw new Error(error.message);
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <auten_usuario.Provider value={{ user, loading, login, logout }}>
      {children}
    </auten_usuario.Provider>
  );
};

export const usar_auten = () => {
  const context = useContext(auten_usuario);
  if (!context) {
    throw new Error('usar_auten deve ser usado dentro de um AuthProvider');
  }
  return context;
};