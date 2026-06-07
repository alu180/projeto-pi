import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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

const NOMES_DOS_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DIAS_DA_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Gera uma grade 2D (linhas × 7 colunas) com os dias do mês
function gerarGradeCalendario(ano, mes) {
  // mes é 0-11
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0=domingo
  const offset = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1;

  const celulas = [];
  for (let i = 0; i < offset; i++) celulas.push(null);
  for (let dia = 1; dia <= ultimoDia; dia++) celulas.push(dia);
  while (celulas.length % 7 !== 0) celulas.push(null);

  const linhas = [];
  for (let i = 0; i < celulas.length; i += 7) {
    linhas.push(celulas.slice(i, i + 7));
  }
  return linhas;
}

const Pag_calendario = ({ navigation, route }) => {
  // Data de referência: hoje
  const hoje = new Date();
  const mesAtual = hoje.getMonth(); // 0-11
  const anoAtual = hoje.getFullYear();
  const nomeMes = NOMES_DOS_MESES[mesAtual];

  // Grade do calendário (calculada uma vez)
  const gradeCalendario = gerarGradeCalendario(anoAtual, mesAtual);

  // Sala recebida da tela anterior
  const sala = route.params?.sala;

  // Estados
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [diasIndisponiveis, setDiasIndisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca disponibilidade da sala no backend
  useEffect(() => {
    const buscarDisponibilidade = async () => {
      if (!sala?.id) {
        setCarregando(false);
        return;
      }
      try {
        setCarregando(true);
        const resposta = await api.get(
          `/salas/${sala.id}/disponibilidade?mes=${mesAtual + 1}&ano=${anoAtual}`
        );
        setDiasIndisponiveis(resposta.data.indisponiveis || []);
      } catch (err) {
        // Se falhar, assume tudo disponível (graceful degradation)
        console.log('Erro ao buscar disponibilidade:', err.message);
        setDiasIndisponiveis([]);
      } finally {
        setCarregando(false);
      }
    };
    buscarDisponibilidade();
  }, [sala]);

  const confirmar = () => {
    // Bloqueia se o dia selecionado está indisponível
    if (diasIndisponiveis.includes(diaSelecionado)) {
      Alert.alert(
        'Dia indisponível',
        'Por favor, selecione um dia disponível (sem ser fim de semana ou data passada).'
      );
      return;
    }
    navigation.navigate('Horarios', {
      sala,
      dia: diaSelecionado,
      mes: mesAtual + 1, // converte pra 1-12 antes de mandar pro backend
      ano: anoAtual,
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

      {/* Etiqueta com a sala selecionada */}
      {sala && (
        <View style={styles.salaInfo}>
          <Ionicons name="school" size={18} color={CORES.primariaDark} />
          <Text style={styles.salaInfoTexto}>
            Sala selecionada: <Text style={styles.salaNome}>{sala.nome}</Text>
            {sala.bloco ? ` (${sala.bloco}, ${sala.andar})` : ''}
          </Text>
        </View>
      )}

      {/* Card calendário */}
      <View style={styles.cardCalendario}>
        <Text style={styles.mesNome}>
          {nomeMes} {anoAtual}
        </Text>

        {/* Cabeçalho dos dias da semana */}
        <View style={styles.linhaCalendario}>
          {DIAS_DA_SEMANA.map((d) => (
            <Text key={d} style={styles.diaSemana}>{d}</Text>
          ))}
        </View>

        {/* Linhas de datas (geradas dinamicamente) */}
        {carregando ? (
          <View style={styles.carregando}>
            <ActivityIndicator size="small" color={CORES.branco} />
            <Text style={styles.carregandoTexto}>Carregando...</Text>
          </View>
        ) : (
          gradeCalendario.map((semana, i) => (
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
                    disabled={indisponivel}
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
          ))
        )}
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
  salaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: CORES.cinzaMedio,
    borderRadius: 10,
    gap: 8,
  },
  salaInfoTexto: {
    fontSize: 13,
    color: CORES.texto,
    flex: 1,
  },
  salaNome: {
    fontWeight: 'bold',
    color: CORES.primariaDark,
  },
  cardCalendario: {
    margin: 16,
    backgroundColor: CORES.primaria,
    borderRadius: 14,
    padding: 16,
  },
  mesNome: {
    color: CORES.branco,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  linhaCalendario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diaSemana: {
    color: CORES.branco,
    fontSize: 12,
    width: 36,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  celulaVazia: { width: 36 },
  celulaDia: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  diaSelecionado: { borderWidth: 2, borderColor: CORES.branco },
  diaNumero: { color: CORES.branco, fontSize: 14 },
  diaNumeroSelecionado: { fontWeight: 'bold' },
  diaIndisponivel: { color: CORES.vermelho },
  carregando: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  carregandoTexto: {
    color: CORES.branco,
    fontSize: 12,
    marginTop: 8,
  },
});