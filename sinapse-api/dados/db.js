// dados/db.js
// Banco de dados simulado em memória.

const usuarios = [
  { id: 1, username: 'aluno', password: '1234', nome: 'Aluno com um sobrenome de aluno', matricula: '202312345', curso: 'Ciência da Computação', instituicao: 'IESB' },
];

const salas = [
  { id: 1,  nome: 'Sala CB1', bloco: 'Bloco C', andar: 'Segundo Andar' },
  { id: 2,  nome: 'Sala CB2', bloco: 'Bloco C', andar: 'Segundo Andar' },
  { id: 3,  nome: 'Sala CB3', bloco: 'Bloco C', andar: 'Segundo Andar' },
  { id: 4,  nome: 'Sala 3',   bloco: 'Biblioteca', andar: 'Segundo Andar' },
  { id: 5,  nome: 'Sala CA1', bloco: 'Bloco C', andar: 'Primeiro Andar' },
  { id: 6,  nome: 'Sala CB5', bloco: 'Bloco C', andar: 'Segundo Andar' },
  { id: 7,  nome: 'Sala CA2', bloco: 'Bloco C', andar: 'Primeiro Andar' },
  { id: 8,  nome: 'Sala CA3', bloco: 'Bloco C', andar: 'Primeiro Andar' },
  { id: 9,  nome: 'Sala CA4', bloco: 'Bloco C', andar: 'Primeiro Andar' },
  { id: 10, nome: 'Sala CA5', bloco: 'Bloco C', andar: 'Primeiro Andar' },
  { id: 11, nome: 'Sala CC1', bloco: 'Bloco C', andar: 'Terceiro Andar' },
  { id: 12, nome: 'Sala CC2', bloco: 'Bloco C', andar: 'Terceiro Andar' },
  { id: 13, nome: 'Sala CC3', bloco: 'Bloco C', andar: 'Terceiro Andar' },
  { id: 14, nome: 'Sala CC4', bloco: 'Bloco C', andar: 'Terceiro Andar' },
];

const livros = [
  { id: 1, userId: 1, obra: 'S.O.S Cálculo II',     autor: 'Minha Mente', emprestimo: '02/06/2025', devolucao: '15/09/2025', icone: 'school'  },
  { id: 2, userId: 1, obra: 'Programação é legal',  autor: 'Minha Mente', emprestimo: '14/09/2025', devolucao: '15/12/2025', icone: 'desktop' },
];

// Notificações iniciais — só avisos genéricos.
// "Reserva Confirmada" será criada automaticamente quando o usuário fizer uma reserva.
const notificacoes = [
  {
    id: 1,
    userId: 1,
    tipo: 'aviso',
    titulo: 'Devolução próxima',
    mensagem: 'O prazo de devolução do livro "S.O.S Cálculo 1" está perto de vencer.',
  },
];

const atividades = [
  {
    id: 1,
    userId: 1,
    categoria: 'Biblioteca',
    icone: 'book',
    data: 'Terça-Feira (02/06/2025)',
    titulo: 'S.O.S Cálculo 1',
    validoAte: '20/09/2025',
  },
];

// Reservas começa vazio — o app vai criar via POST
const reservas = [];

module.exports = { usuarios, salas, livros, notificacoes, atividades, reservas };