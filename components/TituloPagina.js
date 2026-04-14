import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CORES } from './cores';

/**
 * Título de página
 */
const TituloPagina = ({ titulo, icone, direita }) => (
  <View style={styles.container}>
    <View style={styles.linha}>
      <View style={styles.textoLinha}>
        <Text style={styles.titulo}>{titulo}</Text>
        {icone ? <Text style={styles.icone}>{icone}</Text> : null}
      </View>
      {direita || null}
    </View>
    <View style={styles.sublinhado} />
  </View>
);

export default TituloPagina;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 14, marginBottom: 6 },
  linha:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textoLinha:{ flexDirection: 'row', alignItems: 'center' },
  titulo:    { fontSize: 26, fontWeight: 'bold', color: CORES.texto },
  icone:     { fontSize: 28, marginLeft: 8 },
  sublinhado:{ height: 2, backgroundColor: CORES.primaria, marginTop: 4, width: '55%' },
});