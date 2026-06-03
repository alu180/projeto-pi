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

// Mapeia cada tipo de notificação ao seu ícone
const iconePorTipo = {
  reserva: { nome: 'shield-checkmark', cor: CORES.verde },
  aviso:   { nome: 'warning', cor: '#E0A800' },
};

// Card de uma notificação individual
const CardNotificacao = ({ item }) => {
  const icone = iconePorTipo[item.tipo];
  return (
    <View style={styles.card}>
      <View style={styles.cardTituloLinha}>
        <Text style={styles.cardTitulo}>{item.titulo}</Text>
        {icone && (
          <Ionicons name={icone.nome} size={22} color={icone.cor} />
        )}
      </View>
      {item.mensagem ? (
        <Text style={styles.cardTexto}>{item.mensagem}</Text>
      ) : null}
    </View>
  );
};

// Card de uma atividade individual
const CardAtividade = ({ item }) => (
  <View style={styles.cardAtividade}>
    <View style={styles.atividadeCabecalho}>
      <Ionicons name={item.icone || 'book'} size={16} color={CORES.primaria} />
      <Text style={styles.atividadeCategoria}> {item.categoria}</Text>
    </View>
    <Text style={styles.atividadeData}>{item.data}</Text>
    <Text style={styles.atividadeTexto}>Título: {item.titulo}</Text>
    <Text style={styles.atividadeTexto}>Válido até: {item.validoAte}</Text>
  </View>
);

const Pag_notificacoes = ({ navigation }) => {
  const { user } = usar_auten();

  const [notificacoes, setNotificacoes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca notificações e atividades EM PARALELO (Promise.all)
  useEffect(() => {
    const buscar = async () => {
      if (!user?.id) return;

      try {
        setCarregando(true);
        setErro(null);

        const [respNotif, respAtiv] = await Promise.all([
          api.get(`/notificacoes/${user.id}`),
          api.get(`/atividades/${user.id}`),
        ]);

        setNotificacoes(respNotif.data);
        setAtividades(respAtiv.data);
      } catch (err) {
        const msg = err.response?.data?.erro || 'Falha ao carregar notificações';
        setErro(msg);
        Alert.alert('Erro', msg);
      } finally {
        setCarregando(false);
      }
    };
    buscar();
  }, [user]);

  // Componente que mostra a seção de atividades como rodapé da FlatList
  const renderRodape = () => (
    <View>
      <TituloPagina
        titulo="Registro de Atividade"
        icone={<Ionicons name="clipboard" size={28} color={CORES.primaria} />}
      />
      {atividades.length === 0 ? (
        <View style={styles.centralizado}>
          <Text style={styles.textoVazio}>Nenhuma atividade registrada.</Text>
        </View>
      ) : (
        atividades.map((item) => <CardAtividade key={item.id} item={item} />)
      )}
    </View>
  );

  // Componente que mostra o título "Notificações" como cabeçalho da FlatList
  const renderCabecalho = () => (
    <TituloPagina
      titulo="Notificações"
      icone={<Ionicons name="notifications" size={28} color={CORES.primaria} />}
    />
  );

  // Decide o que renderizar de acordo com o estado
  const renderConteudo = () => {
    if (carregando) {
      return (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={styles.textoCarregando}>Carregando notificações...</Text>
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
        data={notificacoes}
        renderItem={({ item }) => <CardNotificacao item={item} />}
        keyExtractor={(item) => `notif-${item.id}`}
        ListHeaderComponent={renderCabecalho}
        ListFooterComponent={renderRodape}
        ListEmptyComponent={
          <View style={styles.centralizado}>
            <Text style={styles.textoVazio}>Nenhuma notificação no momento.</Text>
          </View>
        }
        contentContainerStyle={styles.conteudo}
      />
    );
  };

  return (
    <View style={styles.tela}>
      <Header />
      {renderConteudo()}
      <BottomNav navigation={navigation} rotaAtiva="Home" />
    </View>
  );
};

export default Pag_notificacoes;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  conteudo: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    borderWidth: 2,
    borderColor: CORES.primaria,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  cardTituloLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: { fontWeight: 'bold', fontSize: 15, flex: 1 },
  cardTexto: { fontSize: 14, marginTop: 6 },
  cardAtividade: {
    borderWidth: 2,
    borderColor: CORES.primaria,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  atividadeCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  atividadeCategoria: { fontWeight: 'bold', color: CORES.primaria },
  atividadeData: { fontWeight: 'bold', marginBottom: 4 },
  atividadeTexto: { fontSize: 13, color: '#444', marginTop: 2 },
  centralizado: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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