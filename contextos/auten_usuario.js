import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Função de login: chama a API, persiste e atualiza o estado
  const login = async (username, password) => {
    // Substitua pela sua chamada real à API
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'apiaqui.com', user: username });
      }, 1000);
    });

    // Persistir token e dados
    await AsyncStorage.setItem('userToken', response.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.user));

    // Atualizar estado global
    setUser(response.user);
    return response;
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