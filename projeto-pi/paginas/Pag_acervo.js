import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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

const CardAcervo = ({ item, onEmprestar }) => (
  <View style={styles.card}>
    <View style={styles.capa}>
      <Ionicons name={item.icone || 'book'} size={36} color={CORES.branco} />
    </View>
    <View style={styles.detalhes}>
      <Text style={styles.obra}>{item.obra}</Text>
      <Text style={styles.autor}>Autor: {item.autor}</Text>
      <Text style={styles.idObra}>ID: {String(item.id).padStart(9, '*')}</Text>
      <TouchableOpacity style={styles.botaoEmprestar} onPress={() => onEmprestar(item)}>
        <Ionicons name="bookmark" size={14} color={CORES.branco} />
        <Text style={styles.botaoEmprestarTexto}>Pegar emprestado</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Pag_acervo = ({ navigation }) => {
  const { user } = usar_auten();
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarAcervo = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await api.get('/livros/disponiveis/lista');
      setLivros(resposta.data);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Falha ao buscar acervo';
      setErro(msg);
      Alert.alert('Erro', msg);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarAcervo();
  }, [buscarAcervo]);

  const emprestarLivro = (livro) => {
    Alert.alert(
      'Pegar emprestado?',
      `Deseja pegar "${livro.obra}" emprestado por 15 dias?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.put(`/livros/${livro.id}/emprestar`, { userId: user.id });
              // Remove o livro do acervo local
              setLivros((prev) => prev.filter((l) => l.id !== livro.id));
              Alert.alert(
                'Sucesso!',
                'Livro adicionado à sua biblioteca.',
                [{ text: 'OK', onPress: () => navigation.navigate('Biblioteca') }]
              );
            } catch (err) {
              const msg = err.response?.data?.erro || 'Erro ao emprestar livro';
              Alert.alert('Erro', msg);
            }
          },
        },
      ]
    );
  };

  const renderConteudo = () => {
    if (carregando) {
      return (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={styles.textoCarregando}>Carregando acervo...</Text>
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
          <Text style={styles.textoVazio}>Nenhum livro disponível no momento.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={livros}
        renderItem={({ item }) => <CardAcervo item={item} onEmprestar={emprestarLivro} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
      />
    );
  };

  return (
    <View style={styles.tela}>
      <Header />
      <TituloPagina
        titulo="Acervo da Biblioteca"
        icone={<Ionicons name="library" size={28} color={CORES.primaria} />}
        direita={
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.navigate('Biblioteca')}
          >
            <Ionicons name="arrow-back" size={18} color={CORES.branco} />
          </TouchableOpacity>
        }
      />
      {renderConteudo()}
      <BottomNav navigation={navigation} rotaAtiva="Biblioteca" />
    </View>
  );
};

export default Pag_acervo;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  lista: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: CORES.cinzaMedio,
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
  },
  capa: {
    width: 60,
    height: 60,
    backgroundColor: CORES.primaria,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detalhes: { flex: 1 },
  obra: { fontWeight: 'bold', fontSize: 14, color: CORES.texto },
  autor: { fontSize: 12, color: '#444', marginTop: 2 },
  idObra: { fontSize: 11, color: '#888', marginTop: 2 },
  botaoEmprestar: {
    flexDirection: 'row',
    backgroundColor: CORES.verde,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
    alignItems: 'center',
  },
  botaoEmprestarTexto: {
    color: CORES.branco,
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoVoltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  textoCarregando: { marginTop: 10, color: CORES.primariaDark, fontSize: 14 },
  textoErro: { color: CORES.vermelho, fontSize: 14, textAlign: 'center' },
  textoVazio: { color: CORES.primariaDark, fontSize: 14, fontStyle: 'italic' },
});