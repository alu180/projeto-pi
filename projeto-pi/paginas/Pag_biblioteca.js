import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';
import api from '../services/api';
import { usar_auten } from '../contextos/auten_usuario';

// Componente de cada card de livro
const CardLivro = ({ item }) => (
  <View style={styles.card}>
    {/* Capa do livro */}
    <View style={styles.capa}>
      <Text style={styles.capaTitulo}>{item.obra}</Text>
      <Ionicons
        name={item.icone || 'book'}
        size={36}
        color={CORES.branco}
        style={styles.capaIcone}
      />
    </View>
    {/* Detalhes do livro */}
    <View style={styles.detalhes}>
      <Text style={styles.detalheTexto}>Obra: {item.obra}</Text>
      <Text style={styles.detalheTexto}>Autor: {item.autor}</Text>
      <Text style={styles.detalheTexto}>
        ID: {String(item.id).padStart(9, '*')}
      </Text>
      <Text style={styles.detalheTexto}>
        Data de empréstimo: {item.emprestimo}
      </Text>
      <Text style={styles.detalheTexto}>
        Data de devolução: {item.devolucao}
      </Text>
    </View>
  </View>
);

const Pag_biblioteca = ({ navigation }) => {
  // Pega o usuário logado do contexto (precisamos do user.id)
  const { user } = usar_auten();

  // Estados da requisição
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // useEffect que dispara quando a tela monta OU quando o usuário muda
  useEffect(() => {
    const buscarLivros = async () => {
      // Se ainda não tem usuário não tenta buscar
      if (!user?.id) return;

      try {
        setCarregando(true);
        setErro(null);
        const resposta = await api.get(`/livros/${user.id}`);
        setLivros(resposta.data);
      } catch (err) {
        const msg = err.response?.data?.erro || 'Falha ao buscar livros';
        setErro(msg);
        Alert.alert('Erro', msg);
      } finally {
        setCarregando(false);
      }
    };
    buscarLivros();
  }, [user]);

  // Decide o que mostrar com base nos estados
  const renderConteudo = () => {
    if (carregando) {
      return (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={styles.textoCarregando}>Carregando livros...</Text>
        </View>
      );
    }

    if (erro) {
      return (
        <View style={styles.centralizado}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      );
    }

    if (livros.length === 0) {
      return (
        <View style={styles.centralizado}>
          <Text style={styles.textoVazio}>
            Nenhum livro emprestado no momento.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={livros}
        renderItem={({ item }) => <CardLivro item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
      />
    );
  };

  return (
    <View style={styles.tela}>
      <Header />
      <TituloPagina
        titulo="Biblioteca"
        icone={<Ionicons name="book" size={28} color={CORES.primaria} />}
      />
      {renderConteudo()}
      <BottomNav navigation={navigation} rotaAtiva="Biblioteca" />
    </View>
  );
};

export default Pag_biblioteca;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  lista: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: CORES.cinzaEscuro,
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
  },
  capa: {
    width: 110,
    backgroundColor: '#6E6E6E',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capaTitulo: {
    color: CORES.branco,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  capaIcone: { marginTop: 10 },
  detalhes: { flex: 1, padding: 12 },
  detalheTexto: { color: CORES.branco, fontSize: 12, marginBottom: 3 },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoCarregando: {
    marginTop: 10,
    color: CORES.primariaDark,
    fontSize: 14,
  },
  textoErro: {
    color: CORES.vermelho,
    fontSize: 14,
    textAlign: 'center',
  },
  textoVazio: {
    color: CORES.primariaDark,
    fontSize: 14,
    fontStyle: 'italic',
  },
});