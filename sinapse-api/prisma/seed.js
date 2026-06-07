// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Usuário de teste
  const aluno = await prisma.usuario.create({
    data: {
      username: 'aluno',
      password: '1234',
      nome: 'Aluno com um sobrenome de aluno',
      matricula: '202312345',
      curso: 'Ciência da Computação',
      instituicao: 'IESB',
    },
  });
  console.log(`Usuário criado: id=${aluno.id}`);

  // 14 salas
  await prisma.sala.createMany({
    data: [
      { nome: 'Sala CB1', bloco: 'Bloco C',    andar: 'Segundo Andar' },
      { nome: 'Sala CB2', bloco: 'Bloco C',    andar: 'Segundo Andar' },
      { nome: 'Sala CB3', bloco: 'Bloco C',    andar: 'Segundo Andar' },
      { nome: 'Sala 3',   bloco: 'Biblioteca', andar: 'Segundo Andar' },
      { nome: 'Sala CA1', bloco: 'Bloco C',    andar: 'Primeiro Andar' },
      { nome: 'Sala CB5', bloco: 'Bloco C',    andar: 'Segundo Andar' },
      { nome: 'Sala CA2', bloco: 'Bloco C',    andar: 'Primeiro Andar' },
      { nome: 'Sala CA3', bloco: 'Bloco C',    andar: 'Primeiro Andar' },
      { nome: 'Sala CA4', bloco: 'Bloco C',    andar: 'Primeiro Andar' },
      { nome: 'Sala CA5', bloco: 'Bloco C',    andar: 'Primeiro Andar' },
      { nome: 'Sala CC1', bloco: 'Bloco C',    andar: 'Terceiro Andar' },
      { nome: 'Sala CC2', bloco: 'Bloco C',    andar: 'Terceiro Andar' },
      { nome: 'Sala CC3', bloco: 'Bloco C',    andar: 'Terceiro Andar' },
      { nome: 'Sala CC4', bloco: 'Bloco C',    andar: 'Terceiro Andar' },
    ],
  });
  console.log('14 salas criadas');

  // 2 livros emprestados pro aluno (datas atualizadas)
  await prisma.livro.createMany({
    data: [
      {
        userId: aluno.id,
        obra: 'S.O.S Cálculo 1',
        autor: 'Minha Mente',
        emprestimo: '01/06/2026',
        devolucao: '15/06/2026',
        icone: 'school',
        status: 'emprestado',
      },
      {
        userId: aluno.id,
        obra: 'Programação é legal',
        autor: 'Minha Mente',
        emprestimo: '10/06/2026',
        devolucao: '25/06/2026',
        icone: 'desktop',
        status: 'emprestado',
      },
    ],
  });
  console.log('2 livros emprestados criados');

  // 6 livros disponíveis no acervo
  await prisma.livro.createMany({
    data: [
      { obra: 'Algoritmos Estruturados',          autor: 'Guimarães',   icone: 'code-slash', status: 'disponivel' },
      { obra: 'Estrutura de Dados em Java',       autor: 'Goodrich',    icone: 'library',    status: 'disponivel' },
      { obra: 'Redes de Computadores',            autor: 'Tanenbaum',   icone: 'wifi',       status: 'disponivel' },
      { obra: 'Sistemas Operacionais Modernos',   autor: 'Tanenbaum',   icone: 'desktop',    status: 'disponivel' },
      { obra: 'Engenharia de Software',           autor: 'Sommerville', icone: 'construct',  status: 'disponivel' },
      { obra: 'Banco de Dados Conceitual',        autor: 'Elmasri',     icone: 'server',     status: 'disponivel' },
    ],
  });
  console.log('6 livros disponíveis no acervo criados');

  // 2 atividades iniciais — uma para cada livro emprestado
  await prisma.atividade.createMany({
    data: [
      {
        userId: aluno.id,
        categoria: 'Biblioteca',
        icone: 'book',
        data: 'Segunda-Feira (01/06/2026)',
        titulo: 'S.O.S Cálculo 1',
        validoAte: '15/06/2026',
      },
      {
        userId: aluno.id,
        categoria: 'Biblioteca',
        icone: 'book',
        data: 'Quarta-Feira (10/06/2026)',
        titulo: 'Programação é legal',
        validoAte: '25/06/2026',
      },
    ],
  });
  console.log('2 atividades iniciais criadas');

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });