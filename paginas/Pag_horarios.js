import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';
//horarios de exemplo
const periodos = {
  matutino:   ['08h30','09h30','10h30','11h30','12h30'],
  vespertino: ['13h30','14h30','15h30','16h30','17h30'],
  noturno:    ['18h30','19h30','20h30','21h30','22h30'],
};

const Pag_horarios = ({ navigation, route }) => {
  const [horarioSelecionado, setHorarioSelecionado] = useState('17h30');
  const dia  = route.params?.dia  || 10;
  const sala = route.params?.sala || 'Sala CB1';

  const confirmar = () => {
    // confirmar a reserva
    alert(`Reserva confirmada!\n${sala}\nDia ${dia}/09 às ${horarioSelecionado}`);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.tela}>
      <Header />

      <TituloPagina
        titulo={`Quarta - feira (${dia}/09)`}
        direita={
          <TouchableOpacity style={styles.botaoConfirmar} onPress={confirmar}>
            <Text style={styles.botaoConfirmarTexto}>✓</Text>
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
            {['matutino', 'vespertino', 'noturno'].map((p) => {
              const horario = periodos[p][linha];
              const ativo   = horario === horarioSelecionado;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.celula, ativo && styles.celulaAtiva]}
                  onPress={() => setHorarioSelecionado(horario)}
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
  tela:   { flex: 1, backgroundColor: CORES.branco },
  tabela: { flex: 1, paddingHorizontal: 16 },
  botaoConfirmar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CORES.primaria,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoConfirmarTexto: { color: CORES.branco, fontSize: 20, fontWeight: 'bold' },
  linhaTabela: { flexDirection: 'row', borderBottomWidth: 1, borderColor: CORES.borda },
  celula: {
    flex: 1, paddingVertical: 14,
    justifyContent: 'center', alignItems: 'center',
    borderRightWidth: 1, borderColor: CORES.borda,
  },
  celulaHeader: { paddingVertical: 10 },
  headerTexto:  { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  celulaAtiva:  { backgroundColor: CORES.primaria },
  celulaTexto:  { fontSize: 14 },
  celulaTextoAtivo: { color: CORES.branco, fontWeight: 'bold' },
});