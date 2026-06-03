import React, { useState } from 'react';
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

// horarios de exemplo
const periodos = {
  matutino: ['08h30', '09h30', '10h30', '11h30', '12h30'],
  vespertino: ['13h30', '14h30', '15h30', '16h30', '17h30'],
  noturno: ['18h30', '19h30', '20h30', '21h30', '22h30'],
};

const Pag_horarios = ({ navigation, route }) => {
  const { user } = usar_auten();
  const [horarioSelecionado, setHorarioSelecionado] = useState('17h30');
  const [enviando, setEnviando] = useState(false);

  const dia = route.params?.dia || 10;
  const sala = route.params?.sala || { id: 1, nome: 'Sala CB1' };

  const confirmar = async () => {
    // Validação defensiva
    if (!user?.id || !sala?.id) {
      Alert.alert('Erro', 'Dados incompletos para fazer a reserva.');
      return;
    }

    try {
      setEnviando(true);

      // POST pro backend
      await api.post('/reservas', {
        userId: user.id,
        salaId: sala.id,
        dia,
        horario: horarioSelecionado,
      });

      // Sucesso: avisa e volta pra Home (que vai re-buscar notificações)
      Alert.alert(
        'Reserva Confirmada!',
        `${sala.nome}\nDia ${dia}/09 às ${horarioSelecionado}`,
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
        titulo={`Quarta - feira (${dia}/09)`}
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
              return (
                <TouchableOpacity
                  key={periodo}
                  style={[styles.celula, ativo && styles.celulaAtiva]}
                  onPress={() => !enviando && setHorarioSelecionado(horario)}
                  disabled={enviando}
                >
                  <Text style={[styles.celulaTexto, ativo && styles.celulaTextoAtivo]}>
                    {horario}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

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
  celulaTexto: { fontSize: 14 },
  celulaTextoAtivo: { color: CORES.branco, fontWeight: 'bold' },
});