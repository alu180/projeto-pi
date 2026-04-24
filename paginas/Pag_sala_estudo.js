import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import TituloPagina from '../components/TituloPagina';
import BottomNav from '../components/BottomNav';
import { CORES } from '../components/cores';

/*
    Página de Sala de Estudo dados de exemplo
*/
const salas = [
  'Sala CB1  : Bloco C, Segundo Andar',
  'Sala CB2  : Bloco C, Segundo Andar',
  'Sala CB3  : Bloco C, Segundo Andar',
  'Sala 3    : Biblioteca, Segundo Andar',
  'Sala CA1  : Bloco C, Primeiro Andar',
  'Sala CB5  : Bloco C, Segundo Andar',
  'Sala CA2  : Bloco C, Primeiro Andar',
  'Sala CA3  : Bloco C, Primeiro Andar',
  'Sala CA4  : Bloco C, Primeiro Andar',
  'Sala CA5  : Bloco C, Primeiro Andar',
  'Sala CC1  : Bloco C, Terceiro Andar',
  'Sala CC2  : Bloco C, Terceiro Andar',
  'Sala CC3  : Bloco C, Terceiro Andar',
  'Sala CC4  : Bloco C, Terceiro Andar',
];

const Pag_sala_estudo = ({ navigation }) => {
  const [salaSelecionada, setSalaSelecionada] = useState(null);

  const selecionarSala = (sala) => {
    setSalaSelecionada(sala);
    navigation.navigate('Calendario', { sala });
  };

  const botaoSeletor = (
    <TouchableOpacity style={styles.botaoSeletor}>
      <Text style={styles.botaoSeletorTexto}>
        {salaSelecionada ? salaSelecionada.split(':')[0].trim() : 'Selecione uma sala:'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tela}>
      <Header />
      <TituloPagina
        titulo={'Sala de\nEstudo'}
        icone={<Ionicons name="school" size={30} color={CORES.primaria} />}
        direita={botaoSeletor}
      />
      <ScrollView style={styles.lista}>
        {salas.map((sala, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemLista}
            onPress={() => selecionarSala(sala)}
          >
            <Text style={styles.itemTexto}>{sala}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNav navigation={navigation} rotaAtiva="SalaEstudo" />
    </View>
  );
};

export default Pag_sala_estudo;

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.branco },
  lista: { flex: 1, paddingHorizontal: 16 },
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
});