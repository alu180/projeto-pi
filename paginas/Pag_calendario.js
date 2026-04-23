import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';

const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const diasSetembro = [
  [null, null, null, null, null, null, null],
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];
const diasIndisponiveis = [1, 2, 3, 6, 7, 13, 14, 16, 17, 18, 19, 20, 21];

const Pag_calendario = ({ navigation, route }) => {
  const [diaSelecionado, setDiaSelecionado] = useState(10);

  const confirmar = () => {
    navigation.navigate('Horarios', {
      sala: route.params?.sala,
      dia: diaSelecionado,
    });
  };

  return (
    <View style={styles.tela}>
      <Header />

      <TituloPagina
        titulo="Dias e Horários Disponíveis"
        direita={
          <TouchableOpacity style={styles.botaoConfirmar} onPress={confirmar}>
            <Ionicons name="checkmark" size={24} color={CORES.branco} />
          </TouchableOpacity>
        }
      />

      <View style={styles.cardCalendario}>
        <Text style={styles.mesNome}>Setembro</Text>

        <View style={styles.linhaCalendario}>
          {diasSemana.map((d) => (
            <Text key={d} style={styles.diaSemana}>{d}</Text>
          ))}
        </View>

        {diasSetembro.slice(1).map((semana, i) => (
          <View key={i} style={styles.linhaCalendario}>
            {semana.map((dia, j) => {
              if (!dia) return <View key={j} style={styles.celulaVazia} />;
              const selecionado = dia === diaSelecionado;
              const indisponivel = diasIndisponiveis.includes(dia);
              return (
                <TouchableOpacity
                  key={j}
                  style={[styles.celulaDia, selecionado && styles.diaSelecionado]}
                  onPress={() => !indisponivel && setDiaSelecionado(dia)}
                >
                  <Text
                    style={[
                      styles.diaNumero,
                      selecionado && styles.diaNumeroSelecionado,
                      indisponivel && styles.diaIndisponivel,
                    ]}
                  >
                    {dia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <BottomNav navigation={navigation} rotaAtiva="SalaEstudo" />
    </View>
  );
};

export default Pag_calendario;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  botaoConfirmar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCalendario: {
    margin: 16,
    backgroundColor: CORES.primaria,
    borderRadius: 14,
    padding: 16,
  },
  mesNome: { color: CORES.branco, fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  linhaCalendario: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  diaSemana: { color: CORES.branco, fontSize: 12, width: 36, textAlign: 'center', fontWeight: 'bold' },
  celulaVazia: { width: 36 },
  celulaDia: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 18 },
  diaSelecionado: { borderWidth: 2, borderColor: CORES.branco },
  diaNumero: { color: CORES.branco, fontSize: 14 },
  diaNumeroSelecionado: { fontWeight: 'bold' },
  diaIndisponivel: { color: CORES.vermelho },
});
