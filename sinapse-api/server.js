// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// ---------- Helpers ----------
const NOMES_DOS_DIAS = [
  'Domingo',
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feira',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sábado',
];

function formatarData(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function adicionarDias(date, dias) {
  const novo = new Date(date);
  novo.setDate(novo.getDate() + dias);
  return novo;
}

// Converte "DD/MM/YYYY" → Date (ou null se inválido)
function parseDataBR(str) {
  if (!str) return null;
  const partes = str.split('/');
  if (partes.length !== 3) return null;
  const [d, m, y] = partes.map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

// Calcula quantos dias faltam até a data alvo
function diasAteData(dataAlvo) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataAlvo);
  alvo.setHours(0, 0, 0, 0);
  const diffMs = alvo - hoje;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, mensagem: 'API Sinapse rodando!' });
});

// ---------- LOGIN ----------
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.usuario.findFirst({ where: { username, password } });
    if (!user) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    res.json({
      token: `fake-token-${user.id}`,
      user: {
        id: user.id,
        nome: user.nome,
        matricula: user.matricula,
        curso: user.curso,
        instituicao: user.instituicao,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- CADASTRO ----------
app.post('/usuarios', async (req, res) => {
  try {
    const { username, password, nome, matricula, curso, instituicao } = req.body;
    if (!username || !password || !nome) {
      return res.status(400).json({ erro: 'Usuário, senha e nome são obrigatórios' });
    }
    if (username.length < 3) {
      return res.status(400).json({ erro: 'Usuário deve ter pelo menos 3 caracteres' });
    }
    if (password.length < 4) {
      return res.status(400).json({ erro: 'Senha deve ter pelo menos 4 caracteres' });
    }
    const existente = await prisma.usuario.findUnique({ where: { username } });
    if (existente) return res.status(409).json({ erro: 'Esse nome de usuário já está em uso' });
    const novoUsuario = await prisma.usuario.create({
      data: {
        username, password, nome,
        matricula: matricula || null,
        curso: curso || null,
        instituicao: instituicao || null,
      },
    });
    res.status(201).json({
      id: novoUsuario.id,
      username: novoUsuario.username,
      nome: novoUsuario.nome,
      matricula: novoUsuario.matricula,
      curso: novoUsuario.curso,
      instituicao: novoUsuario.instituicao,
    });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- SALAS ----------
app.get('/salas', async (req, res) => {
  try {
    const salas = await prisma.sala.findMany({ orderBy: { id: 'asc' } });
    res.json(salas);
  } catch (err) {
    console.error('Erro ao buscar salas:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/salas/:id/disponibilidade', async (req, res) => {
  try {
    const salaId = Number(req.params.id);
    const mes = Number(req.query.mes);
    const ano = Number(req.query.ano);
    if (!mes || !ano || mes < 1 || mes > 12) {
      return res.status(400).json({ erro: 'Parâmetros mes (1-12) e ano são obrigatórios' });
    }
    const sala = await prisma.sala.findUnique({ where: { id: salaId } });
    if (!sala) return res.status(404).json({ erro: 'Sala não encontrada' });

    const ultimoDia = new Date(ano, mes, 0).getDate();
    const hoje = new Date();
    const ehMesAtual = ano === hoje.getFullYear() && (mes - 1) === hoje.getMonth();
    const indisponiveis = [];
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const diaSemana = data.getDay();
      if (diaSemana === 0 || diaSemana === 6) { indisponiveis.push(dia); continue; }
      if (ehMesAtual && dia < hoje.getDate()) { indisponiveis.push(dia); continue; }
    }
    res.json({ mes, ano, indisponiveis });
  } catch (err) {
    console.error('Erro ao buscar disponibilidade:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/salas/:id/horarios', async (req, res) => {
  try {
    const salaId = Number(req.params.id);
    const dia = Number(req.query.dia);
    const mes = Number(req.query.mes);
    const ano = Number(req.query.ano);
    if (!dia || !mes || !ano) {
      return res.status(400).json({ erro: 'Parâmetros dia, mes e ano são obrigatórios' });
    }
    const reservas = await prisma.reserva.findMany({
      where: { salaId, dia, mes, ano },
      select: { horario: true },
    });
    res.json({ salaId, dia, mes, ano, horariosOcupados: reservas.map(r => r.horario) });
  } catch (err) {
    console.error('Erro ao buscar horários ocupados:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- LIVROS ----------
app.get('/livros/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const livros = await prisma.livro.findMany({
      where: { userId, status: 'emprestado' },
      orderBy: { id: 'asc' },
    });
    res.json(livros);
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/livros/disponiveis/lista', async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      where: { status: 'disponivel' },
      orderBy: { obra: 'asc' },
    });
    res.json(livros);
  } catch (err) {
    console.error('Erro ao buscar acervo:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.put('/livros/:id/emprestar', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ erro: 'userId é obrigatório' });

    const livro = await prisma.livro.findUnique({ where: { id } });
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
    if (livro.status !== 'disponivel') {
      return res.status(409).json({ erro: 'Esse livro já está emprestado' });
    }

    const hoje = new Date();
    const dataDevolucao = adicionarDias(hoje, 15);
    const emprestimoStr = formatarData(hoje);
    const devolucaoStr = formatarData(dataDevolucao);

    const livroAtualizado = await prisma.livro.update({
      where: { id },
      data: { userId, status: 'emprestado', emprestimo: emprestimoStr, devolucao: devolucaoStr },
    });

    await prisma.notificacao.create({
      data: {
        userId,
        tipo: 'reserva',
        titulo: 'Livro Emprestado',
        mensagem: `"${livro.obra}" emprestado até ${devolucaoStr}.`,
      },
    });

    // Cria atividade do empréstimo (categoria 'Biblioteca')
    const nomeDiaSemana = NOMES_DOS_DIAS[hoje.getDay()];
    await prisma.atividade.create({
      data: {
        userId,
        categoria: 'Biblioteca',
        icone: 'book',
        data: `${nomeDiaSemana} (${emprestimoStr})`,
        titulo: livro.obra,
        validoAte: devolucaoStr,
      },
    });

    res.json(livroAtualizado);
  } catch (err) {
    console.error('Erro ao emprestar livro:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// DEVOLUÇÃO — apaga a atividade de empréstimo, cria SÓ notificação
app.put('/livros/:id/devolver', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const livro = await prisma.livro.findUnique({ where: { id } });
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
    if (livro.status !== 'emprestado') {
      return res.status(409).json({ erro: 'Esse livro não está emprestado' });
    }

    const userIdAntes = livro.userId;
    const obraAntes = livro.obra;

    const livroAtualizado = await prisma.livro.update({
      where: { id },
      data: { userId: null, status: 'disponivel', emprestimo: null, devolucao: null },
    });

    if (userIdAntes) {
      // 1) APAGA a atividade de empréstimo correspondente
      await prisma.atividade.deleteMany({
        where: {
          userId: userIdAntes,
          categoria: 'Biblioteca',
          titulo: obraAntes,
        },
      });

      // 2) Cria APENAS notificação (sem nova atividade)
      await prisma.notificacao.create({
        data: {
          userId: userIdAntes,
          tipo: 'reserva',
          titulo: 'Livro Devolvido',
          mensagem: `Você devolveu o livro "${obraAntes}". Obrigado!`,
        },
      });
    }

    res.json(livroAtualizado);
  } catch (err) {
    console.error('Erro ao devolver livro:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- NOTIFICAÇÕES (com cálculo dinâmico de "devolução próxima") ----------
app.get('/notificacoes/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // 1) Notificações persistidas no banco
    const notifsPersistidas = await prisma.notificacao.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });

    // 2) Calcula notificações automáticas: livros com ≤5 dias para devolver
    const livrosEmprestados = await prisma.livro.findMany({
      where: { userId, status: 'emprestado' },
    });

    const notifsAutomaticas = [];
    for (const livro of livrosEmprestados) {
      const dataDevolucao = parseDataBR(livro.devolucao);
      if (!dataDevolucao) continue;
      const diasRestantes = diasAteData(dataDevolucao);
      if (diasRestantes >= 0 && diasRestantes <= 5) {
        notifsAutomaticas.push({
          id: `auto-${livro.id}`, // ID string pra distinguir das persistidas
          userId,
          tipo: 'aviso',
          titulo: 'Devolução próxima',
          mensagem: `O prazo de devolução do livro "${livro.obra}" está perto de vencer (${livro.devolucao}).`,
        });
      }
    }

    // 3) Auto vêm primeiro (mais urgentes), depois as persistidas
    res.json([...notifsAutomaticas, ...notifsPersistidas]);
  } catch (err) {
    console.error('Erro ao buscar notificações:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.delete('/notificacoes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Se o id não for número válido (ex: "auto-1"), rejeita
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'Notificações automáticas não podem ser apagadas.' });
    }
    await prisma.notificacao.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ erro: 'Notificação não encontrada' });
    console.error('Erro ao deletar notificação:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- ATIVIDADES ----------
app.get('/atividades/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const ativs = await prisma.atividade.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
    res.json(ativs);
  } catch (err) {
    console.error('Erro ao buscar atividades:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- RESERVAS ----------
app.get('/reservas/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const reservas = await prisma.reserva.findMany({
      where: { userId },
      orderBy: { criadaEm: 'desc' },
    });
    res.json(reservas);
  } catch (err) {
    console.error('Erro ao buscar reservas:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.post('/reservas', async (req, res) => {
  try {
    const { userId, salaId, dia, mes, ano, horario } = req.body;
    if (!userId || !salaId || !dia || !mes || !ano || !horario) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }
    const conflito = await prisma.reserva.findFirst({
      where: { salaId, dia, mes, ano, horario },
    });
    if (conflito) {
      if (conflito.userId === userId) {
        return res.status(409).json({ erro: 'Você já reservou esta sala para este dia e horário.' });
      }
      return res.status(409).json({ erro: 'Esta sala já está reservada por outro usuário neste horário.' });
    }

    const novaReserva = await prisma.reserva.create({
      data: { userId, salaId, dia, mes, ano, horario },
    });

    const sala = await prisma.sala.findUnique({ where: { id: salaId } });
    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(mes).padStart(2, '0');
    const dataObj = new Date(ano, mes - 1, dia);
    const nomeDiaSemana = NOMES_DOS_DIAS[dataObj.getDay()];

    await prisma.notificacao.create({
      data: {
        userId,
        tipo: 'reserva',
        titulo: 'Reserva Confirmada',
        mensagem: `${sala?.nome || 'Sala'} reservada para ${diaStr}/${mesStr}/${ano} às ${horario}.`,
      },
    });

    await prisma.atividade.create({
      data: {
        userId,
        categoria: 'Sala de Estudo',
        icone: 'school',
        data: `${nomeDiaSemana} (${diaStr}/${mesStr}/${ano})`,
        titulo: `${sala?.nome || 'Sala'} às ${horario}`,
        validoAte: `${diaStr}/${mesStr}/${ano}`,
      },
    });

    res.status(201).json(novaReserva);
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.delete('/reservas/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.reserva.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ erro: 'Reserva não encontrada' });
    console.error('Erro ao deletar reserva:', err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ---------- Sobe o servidor ----------
app.listen(PORT, () => {
  console.log(`API Sinapse rodando em http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});