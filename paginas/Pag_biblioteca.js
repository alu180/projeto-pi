import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';

// Dados de exemplo
const livrosEmprestados = [
  {
    id: '1',
    tituloAbrev: 'S.O.S\nCálculo II',
    icone: 'school',
    obra:      'S.O.S Calculo II',
    autor:     'Minha Mente',
    idObra:    '*********',
    emprestimo:'02/06/2025',
    devolucao: '15/09/2025',
  },
  {
    id: '2',
    tituloAbrev: 'Programação\né legal',
    icone: 'desktop',
    obra:      'Programação é legal',
    autor:     'Minha Mente',
    idObra:    '*********',
    emprestimo:'14/09/2025',
    devolucao: '15/12/2025',
  },
];

const CardLivro = ({ item }) => (
  <View style={styles.card}>
    {/* Capa do livro temporário de exemplo */}
    <View style={styles.capa}>
      <Text style={styles.capaTitulo}>{item.tituloAbrev}</Text>
      <Ionicons name={item.icone} size={36} color={CORES.branco} style={{ marginTop: 10 }} />
    </View>
    {/* Detalhes do livro temporário de exemplo */}
    <View style={styles.detalhes}>
      <Text style={styles.detalheTexto}>Obra: {item.obra}</Text>
      <Text style={styles.detalheTexto}>Autor: {item.autor}</Text>
      <Text style={styles.detalheTexto}>ID: {item.idObra}</Text>
      <Text style={styles.detalheTexto}>Data de empréstimo: {item.emprestimo}</Text>
      <Text style={styles.detalheTexto}>Data de devolução: {item.devolucao}</Text>
    </View>
  </View>
);

const Pag_biblioteca = ({ navigation }) => (
  <View style={styles.tela}>
    <Header />
    <ScrollView style={styles.conteudo}>
      <TituloPagina titulo="Biblioteca" icone="📚" />
      {livrosEmprestados.map((livro) => (
        <CardLivro key={livro.id} item={livro} />
      ))}
    </ScrollView>
    <BottomNav navigation={navigation} rotaAtiva="Biblioteca" />
  </View>
);

export default Pag_biblioteca;

const styles = StyleSheet.create({
  tela:    { flex: 1, backgroundColor: CORES.branco },
  conteudo:{ flex: 1, paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: CORES.cinzaEscuro,
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
  },
  capa: {
    width: 110,
    backgroundColor: '#6e6e6e',
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
  detalhes:   { flex: 1, padding: 12 },
  detalheTexto:{ color: CORES.branco, fontSize: 12, marginBottom: 3 },
});