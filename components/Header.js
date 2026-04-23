import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from './cores';

const Header = ({
  nomeAluno = 'Aluno com um sobrenome de aluno',
  matricula = '*********',
  curso = 'Ciência da Computação',
  instituicao = 'IESB',
  data = '10/09/2025',
}) => (
  <View style={styles.container}>
    <View style={styles.avatar}>
      <Ionicons name="happy-outline" size={28} color="#7A7A7A" />
    </View>

    <View style={styles.infoAluno}>
      <Text style={styles.nome}>{nomeAluno}</Text>
      <Text style={styles.matriculaLabel}>Matrícula:</Text>
      <Text style={styles.matriculaValor}>{matricula}</Text>
    </View>

    <View style={styles.divisor} />

    <View style={styles.infoCurso}>
      <Text style={styles.cursoTexto}>Curso: {curso}</Text>
      <Text style={styles.instituicaoLabel}>Instituição:</Text>
      <Text style={styles.instituicaoNome}>{instituicao}</Text>
    </View>

    <Text style={styles.data}>{data}</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: CORES.branco,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#AAA',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  infoAluno: { flex: 1 },
  nome: { fontSize: 10, color: CORES.texto },
  matriculaLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  matriculaValor: { fontSize: 10 },
  divisor: {
    width: 1,
    height: 55,
    backgroundColor: CORES.borda,
    marginHorizontal: 6,
  },
  infoCurso: { flex: 1 },
  cursoTexto: { fontSize: 10 },
  instituicaoLabel: { fontSize: 10, marginTop: 2 },
  instituicaoNome: { fontSize: 10, fontWeight: 'bold' },
  data: { fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
});
