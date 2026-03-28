import { useState } from 'react';

const User_login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Retorna os dados do formulário após validação
  const getFormData = () => {
    if (!validacao()) return null;
    return { username, password };
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError(null);
    setLoading(false);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    setLoading,
    error,
    setError,
    getFormData,
    resetForm,
  };
};

export default User_login;