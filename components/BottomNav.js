import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from './cores';
import { usar_auten } from '../contextos/auten_usuario';

/**
 * Barra de navegação inferior.
 */
const BottomNav = ({ navigation, rotaAtiva }) => {
  const { logout } = usar_auten();

  const ir = (rota) => {
    if (rota !== rotaAtiva) {
      navigation.replace(rota);
    }
  };

  const ativo = (rota) => rotaAtiva === rota;

  return (
    <View style={styles.container}>
      {/* Home / Notificações */}
      <TouchableOpacity
        style={[styles.botao, ativo('Home') && styles.ativo]}
        onPress={() => ir('Home')}
      >
        <Ionicons
          name="home"
          size={24}
          color={ativo('Home') ? CORES.branco : '#666'}
        />
      </TouchableOpacity>

      {/* Biblioteca */}
      <TouchableOpacity
        style={[styles.botao, ativo('Biblioteca') && styles.ativo]}
        onPress={() => ir('Biblioteca')}
      >
        <Ionicons
          name="book"
          size={24}
          color={ativo('Biblioteca') ? CORES.branco : '#666'}
        />
      </TouchableOpacity>

      {/* Sala de Estudo */}
      <TouchableOpacity
        style={[styles.botao, ativo('SalaEstudo') && styles.ativo]}
        onPress={() => ir('SalaEstudo')}
      >
        <Ionicons
          name="school"
          size={24}
          color={ativo('SalaEstudo') ? CORES.branco : '#666'}
        />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.botao, styles.botaoLogout]} onPress={logout}>
        <Ionicons name="power" size={24} color={CORES.branco} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: CORES.branco,
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
  },
  botao: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: CORES.cinzaClaro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ativo:       { backgroundColor: CORES.primaria },
  botaoLogout: { backgroundColor: CORES.preto },
});
