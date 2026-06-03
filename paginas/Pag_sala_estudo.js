import React, { useState, useEffect } from 'react';
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

const Pag_sala_estudo = ({ navigation }) => {
  // Estados da tela
  const [salas, setSalas] = useState([]);             // lista do backend
  const [carregando, setCarregando] = useState(true); // controle do ActivityIndicator
  const [erro, setErro] = useState(null);             // mensagem de erro pra exibir
  const [salaSelecionada, setSalaSelecionada] = useState(null);

  // Roda 1 vez quando a tela é montada
  useEffect(() => {
    const buscarSalas = async () => {
      try {
        setCarregando(true);
        setErro(null);
        const resposta = await api.get('/salas');
        setSalas(resposta.data);
      } catch (err) {
        const msg = err.response?.data?.erro || 'Falha na conexão ao buscar salas';
        setErro(msg);
        Alert.alert('Erro', msg);
      } finally {
        setCarregando(false);
      }
    };
    buscarSalas();
  }, []); // array vazio roda uma vez na montagem

  const selecionarSala = (sala) => {
    setSalaSelecionada(sala);
    // Passa o objeto inteiro pra próxima tela (precisa do id depois)
    navigation.navigate('Calendario', { sala });
  };

  const botaoSeletor = (
    <TouchableOpacity style={styles.botaoSeletor}>
      <Text style={styles.botaoSeletorTexto}>
        {salaSelecionada ? salaSelecionada.nome : 'Selecione uma sala:'}
      </Text>
    </TouchableOpacity>
  );

  // descreve como um item da lista é exibido
  const renderizarSala = ({ item }) => (
    <TouchableOpacity
      style={styles.itemLista}
      onPress={() => selecionarSala(item)}
    >
      <Text style={styles.itemTexto}>
        {item.nome} : {item.bloco}, {item.andar}
      </Text>
    </TouchableOpacity>
  );

  // Componente que mostra enquanto está carregando OU se deu erro
  const renderConteudo = () => {
    if (carregando) {
      return (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={styles.textoCarregando}>Carregando salas...</Text>
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

    return (
      <FlatList
        data={salas}
        renderItem={renderizarSala}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
      />
    );
  };

  return (
    <View style={styles.tela}>
      <Header />
      <TituloPagina
        titulo={'Sala de\nEstudo'}
        icone={<Ionicons name="school" size={30} color={CORES.primaria} />}
        direita={botaoSeletor}
      />
      {renderConteudo()}
      <BottomNav navigation={navigation} rotaAtiva="SalaEstudo" />
    </View>
  );
};

export default Pag_sala_estudo;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  lista: { paddingHorizontal: 16 },
  botaoSeletor: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: CORES.cinzaMedio,
  },
  botaoSeletorTexto: { fontSize: 12, color: CORES.texto },
  itemLista: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  itemTexto: { fontSize: 13 },
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
});