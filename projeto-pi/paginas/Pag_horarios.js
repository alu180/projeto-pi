import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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

const NOMES_DOS_DIAS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const periodos = {
  matutino: ['08h30', '09h30', '10h30', '11h30', '12h30'],
  vespertino: ['13h30', '14h30', '15h30', '16h30', '17h30'],
  noturno: ['18h30', '19h30', '20h30', '21h30', '22h30'],
};

const Pag_horarios = ({ navigation, route }) => {
  const { user } = usar_auten();
  const [horarioSelecionado, setHorarioSelecionado] = useState('17h30');
  const [enviando, setEnviando] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [carregandoOcupados, setCarregandoOcupados] = useState(true);

  const hoje = new Date();
  const dia = route.params?.dia || hoje.getDate();
  const mes = route.params?.mes || (hoje.getMonth() + 1);
  const ano = route.params?.ano || hoje.getFullYear();
  const sala = route.params?.sala || { id: 1, nome: 'Sala CB1' };

  const dataObj = new Date(ano, mes - 1, dia);
  const nomeDiaSemana = NOMES_DOS_DIAS[dataObj.getDay()];
  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');

  // Busca horários já ocupados pra essa sala/data
  useEffect(() => {
    const buscarHorariosOcupados = async () => {
      if (!sala?.id) {
        setCarregandoOcupados(false);
        return;
      }
      try {
        setCarregandoOcupados(true);
        const resposta = await api.get(
          `/salas/${sala.id}/horarios?dia=${dia}&mes=${mes}&ano=${ano}`
        );
        setHorariosOcupados(resposta.data.horariosOcupados || []);
      } catch (err) {
        console.log('Erro ao buscar horários ocupados:', err.message);
        setHorariosOcupados([]);
      } finally {
        setCarregandoOcupados(false);
      }
    };
    buscarHorariosOcupados();
  }, [sala, dia, mes, ano]);

  const confirmar = async () => {
    if (!user?.id || !sala?.id) {
      Alert.alert('Erro', 'Dados incompletos para fazer a reserva.');
      return;
    }

    // Bloqueia se selecionou um horário ocupado
    if (horariosOcupados.includes(horarioSelecionado)) {
      Alert.alert(
        'Horário indisponível',
        'Esse horário já está reservado. Escolha outro.'
      );
      return;
    }

    try {
      setEnviando(true);
      await api.post('/reservas', {
        userId: user.id,
        salaId: sala.id,
        dia,
        mes,
        ano,
        horario: horarioSelecionado,
      });

      Alert.alert(
        'Reserva Confirmada!',
        `${sala.nome}\n${diaStr}/${mesStr}/${ano} às ${horarioSelecionado}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        'Não foi possível confirmar a reserva. Verifique sua conexão.';
      Alert.alert('Falha na reserva', msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.tela}>
      <Header />

      <TituloPagina
        titulo={`${nomeDiaSemana} (${diaStr}/${mesStr})`}
        direita={
          <TouchableOpacity
            style={[styles.botaoConfirmar, enviando && styles.botaoDesabilitado]}
            onPress={confirmar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator size="small" color={CORES.branco} />
            ) : (
              <Ionicons name="checkmark" size={24} color={CORES.branco} />
            )}
          </TouchableOpacity>
        }
      />

      {/* Legenda de cores */}
      <View style={styles.legenda}>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.borda }]} />
          <Text style={styles.legendaTexto}>Disponível</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: CORES.primaria }]} />
          <Text style={styles.legendaTexto}>Selecionado</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaCor, { backgroundColor: CORES.cinzaClaro }]} />
          <Text style={styles.legendaTexto}>Ocupado</Text>
        </View>
      </View>

      {carregandoOcupados ? (
        <View style={styles.centralizadoTopo}>
          <ActivityIndicator size="small" color={CORES.primaria} />
          <Text style={styles.textoCarregando}>Verificando horários...</Text>
        </View>
      ) : (
        <ScrollView style={styles.tabela}>
          {/* Cabeçalho da tabela */}
          <View style={styles.linhaTabela}>
            {['Período\nMatutino\n08h30', 'Período\nVespertino\n13h30', 'Período\nNoturno\n18h30'].map(
              (col, i) => (
                <View key={i} style={[styles.celula, styles.celulaHeader]}>
                  <Text style={styles.headerTexto}>{col}</Text>
                </View>
              )
            )}
          </View>

          {/* Linhas de horários */}
          {[0, 1, 2, 3, 4].map((linha) => (
            <View key={linha} style={styles.linhaTabela}>
              {['matutino', 'vespertino', 'noturno'].map((periodo) => {
                const horario = periodos[periodo][linha];
                const ativo = horario === horarioSelecionado;
                const ocupado = horariosOcupados.includes(horario);

                return (
                  <TouchableOpacity
                    key={periodo}
                    style={[
                      styles.celula,
                      ativo && styles.celulaAtiva,
                      ocupado && styles.celulaOcupada,
                    ]}
                    onPress={() => !enviando && !ocupado && setHorarioSelecionado(horario)}
                    disabled={enviando || ocupado}
                  >
                    <Text
                      style={[
                        styles.celulaTexto,
                        ativo && styles.celulaTextoAtivo,
                        ocupado && styles.celulaTextoOcupada,
                      ]}
                    >
                      {horario}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      <BottomNav navigation={navigation} rotaAtiva="SalaEstudo" />
    </View>
  );
};

export default Pag_horarios;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  tabela: { flex: 1, paddingHorizontal: 16 },
  botaoConfirmar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendaCor: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendaTexto: {
    fontSize: 11,
    color: CORES.texto,
  },
  centralizadoTopo: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 10,
    color: CORES.primariaDark,
    fontSize: 13,
  },
  linhaTabela: { flexDirection: 'row', borderBottomWidth: 1, borderColor: CORES.borda },
  celula: {
    flex: 1,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: CORES.borda,
  },
  celulaHeader: { paddingVertical: 10 },
  headerTexto: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  celulaAtiva: { backgroundColor: CORES.primaria },
  celulaOcupada: { backgroundColor: CORES.cinzaClaro },
  celulaTexto: { fontSize: 14 },
  celulaTextoAtivo: { color: CORES.branco, fontWeight: 'bold' },
  celulaTextoOcupada: {
    color: '#888',
    fontStyle: 'italic',
    textDecorationLine: 'line-through',
  },
});