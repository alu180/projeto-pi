// server.js
const express = require('express');
const cors = require('cors');
const db = require('./dados/db');

const app = express();
const PORT = 3000;

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());

// ---------- Rota raiz só para teste ----------
app.get('/', (req, res) => {
  res.json({ ok: true, mensagem: 'API Sinapse rodando!' });
});

// ---------- LOGIN ----------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.usuarios.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }

  res.json({
    token: `fake-token-${user.id}`,
    user: { id: user.id, nome: user.nome, matricula: user.matricula, curso: user.curso, instituicao: user.instituicao },
  });
});

// ---------- SALAS ----------
app.get('/salas', (req, res) => {
  res.json(db.salas);
});

// ---------- DISPONIBILIDADE DA SALA (mês inteiro) — NOVO ----------
app.get('/salas/:id/disponibilidade', (req, res) => {
  const salaId = Number(req.params.id);
  const mes = Number(req.query.mes); // 1-12
  const ano = Number(req.query.ano);

  if (!mes || !ano || mes < 1 || mes > 12) {
    return res.status(400).json({ erro: 'Parâmetros mes (1-12) e ano são obrigatórios' });
  }

  const sala = db.salas.find(s => s.id === salaId);
  if (!sala) {
    return res.status(404).json({ erro: 'Sala não encontrada' });
  }

  // Último dia do mês: dia 0 do próximo mês = último dia do atual
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const hoje = new Date();
  const ehMesAtual =
    ano === hoje.getFullYear() && (mes - 1) === hoje.getMonth();

  const indisponiveis = [];

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay(); // 0=dom, 6=sáb

    // Fim de semana
    if (diaSemana === 0 || diaSemana === 6) {
      indisponiveis.push(dia);
      continue;
    }

    // Dia já passou (só faz sentido se for o mês atual)
    if (ehMesAtual && dia < hoje.getDate()) {
      indisponiveis.push(dia);
      continue;
    }
  }

  res.json({ mes, ano, indisponiveis });
});

// ---------- LIVROS (de um usuário) ----------
app.get('/livros/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const livrosDoUser = db.livros.filter(l => l.userId === userId);
  res.json(livrosDoUser);
});

// ---------- NOTIFICAÇÕES (de um usuário) ----------
app.get('/notificacoes/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const notifs = db.notificacoes.filter(n => n.userId === userId);
  res.json(notifs);
});

// ---------- ATIVIDADES (de um usuário) ----------
app.get('/atividades/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const ativs = db.atividades.filter(a => a.userId === userId);
  res.json(ativs);
});

// ---------- RESERVAS ----------
// Listar reservas do usuário
app.get('/reservas/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  res.json(db.reservas.filter(r => r.userId === userId));
});

// Criar reserva (MODIFICADO — agora aceita mes/ano e checa conflito por data completa)
app.post('/reservas', (req, res) => {
  const { userId, salaId, dia, mes, ano, horario } = req.body;

  if (!userId || !salaId || !dia || !mes || !ano || !horario) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }

  // Verifica conflito por data completa (sala + dia + mes + ano + horario)
  const conflito = db.reservas.find(
    r =>
      r.salaId === salaId &&
      r.dia === dia &&
      r.mes === mes &&
      r.ano === ano &&
      r.horario === horario
  );
  if (conflito) {
    if (conflito.userId === userId) {
      return res.status(409).json({
        erro: 'Você já reservou esta sala para este dia e horário.',
      });
    }
    return res.status(409).json({
      erro: 'Esta sala já está reservada por outro usuário neste horário.',
    });
  }

  const novaReserva = {
    id: db.reservas.length + 1,
    userId,
    salaId,
    dia,
    mes,
    ano,
    horario,
    criadaEm: new Date().toISOString(),
  };
  db.reservas.push(novaReserva);

  // Cria notificação automática com data formatada
  const sala = db.salas.find(s => s.id === salaId);
  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');
  db.notificacoes.push({
    id: db.notificacoes.length + 1,
    userId,
    tipo: 'reserva',
    titulo: 'Reserva Confirmada',
    mensagem: `${sala?.nome || 'Sala'} reservada para ${diaStr}/${mesStr}/${ano} às ${horario}.`,
  });

  res.status(201).json(novaReserva);
});

// Deletar (cancelar) reserva
app.delete('/reservas/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = db.reservas.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ erro: 'Reserva não encontrada' });
  db.reservas.splice(index, 1);
  res.status(204).send();
});