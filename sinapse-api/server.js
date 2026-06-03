// server.js
const express = require('express');
const cors = require('cors');
const db = require('./dados/db');

const app = express();
const PORT = 3000;

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());

// ---------- Rota só para teste ----------
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

// Criar reserva (com checagem de conflito)
app.post('/reservas', (req, res) => {
  const { userId, salaId, dia, horario } = req.body;

  if (!userId || !salaId || !dia || !horario) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }

  // Verifica se a sala já está reservada para esse dia e horário
  const conflito = db.reservas.find(
    r => r.salaId === salaId && r.dia === dia && r.horario === horario
  );
  if (conflito) {
    // Mensagem diferente dependendo de quem fez a reserva
    if (conflito.userId === userId) {
      return res.status(409).json({
        erro: 'Você já reservou esta sala para este dia e horário.',
      });
    }
    return res.status(409).json({
      erro: 'Esta sala já está reservada por outro usuário neste horário.',
    });
  }

  // Cria a reserva
  const novaReserva = {
    id: db.reservas.length + 1,
    userId,
    salaId,
    dia,
    horario,
    criadaEm: new Date().toISOString(),
  };
  db.reservas.push(novaReserva);

  // Cria também uma notificação automaticamente
  const sala = db.salas.find(s => s.id === salaId);
  db.notificacoes.push({
    id: db.notificacoes.length + 1,
    userId,
    tipo: 'reserva',
    titulo: 'Reserva Confirmada',
    mensagem: `${sala?.nome || 'Sala'} reservada para o dia ${dia} às ${horario}.`,
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

// ---------- Sobe o servidor ----------
app.listen(PORT, () => {
  console.log(`API Sinapse rodando em http://localhost:${PORT}`);
});