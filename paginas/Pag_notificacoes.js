import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';

const Pag_notificacoes = ({ navigation }) => (
  <View style={styles.tela}>
    <Header />

    <ScrollView style={styles.conteudo}>
      <TituloPagina
        titulo="Notificações"
        icone={<Ionicons name="notifications" size={28} color={CORES.primaria} />}
      />

      <View style={styles.card}>
        <View style={styles.cardTituloLinha}>
          <Text style={styles.cardTitulo}>Reserva Confirmada</Text>
          <Ionicons name="shield-checkmark" size={22} color={CORES.verde} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTexto}>
          O prazo de devolução do livro "S.O.S Cálculo 1" está perto de vencer.
        </Text>
      </View>

      <TituloPagina
        titulo="Registro de Atividade"
        icone={<Ionicons name="clipboard" size={28} color={CORES.primaria} />}
      />

      <View style={styles.cardAtividade}>
        <View style={styles.atividadeCabecalho}>
          <Ionicons name="book" size={16} color={CORES.primaria} />
          <Text style={styles.atividadeCategoria}> Biblioteca</Text>
        </View>
        <Text style={styles.atividadeData}>Terça-Feira (02/06/2025)</Text>
        <Text style={styles.atividadeTexto}>Título: S.O.S Cálculo 1</Text>
        <Text style={styles.atividadeTexto}>Válido até: 20/09/2025</Text>
      </View>
    </ScrollView>

    <BottomNav navigation={navigation} rotaAtiva="Home" />
  </View>
);

export default Pag_notificacoes;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  conteudo: { flex: 1, paddingHorizontal: 16 },
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
  cardTitulo: { fontWeight: 'bold', fontSize: 15 },
  cardTexto: { fontSize: 14, textAlign: 'center' },
  cardAtividade: {
    borderWidth: 2,
    borderColor: CORES.primaria,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  atividadeCabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  atividadeCategoria: { fontWeight: 'bold', color: CORES.primaria },
  atividadeData: { fontWeight: 'bold', marginBottom: 4 },
  atividadeTexto: { fontSize: 13, color: '#444', marginTop: 2 },
});
