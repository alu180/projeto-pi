# Sinapse

> Acessibilidade para a sua faculdade.

App mobile + API REST para reservas de salas de estudo e gerenciamento de
biblioteca acadêmica. Projeto Integrador 3 (PI3A) — IESB, Ciência da
Computação.

---

## 📋 Sumário

- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Setup completo (do zero)](#setup-completo-do-zero)
- [Roteiro de testes](#roteiro-de-testes)
- [Endpoints da API](#endpoints-da-api)
- [Problemas comuns](#problemas-comuns)
- [Equipe](#equipe)

---

## Stack

- **Frontend:** React Native 0.83.2 + Expo ~55.0.5
- **Backend:** Node.js 18+ + Express 5
- **ORM:** Prisma 5.22.0
- **Banco de dados:** MySQL 8

---

## Estrutura do repositório

Este é um **monorepo** contendo as duas partes do sistema:

PI3A/
├── projeto-pi/      # App mobile (React Native + Expo)
└── sinapse-api/     # API REST (Node + Express + Prisma + MySQL)

Cada subpasta tem seu próprio `README.md` com instruções mais específicas:

- 📱 [Frontend (projeto-pi)](./projeto-pi/README.md)
- 🔌 [Backend (sinapse-api)](./sinapse-api/README.md)

---

## Funcionalidades

### 🔐 Autenticação
- Login com validação de campos
- Cadastro de novas contas com auto-login
- Sessão persistente (não precisa logar toda vez)

### 📅 Reservas de sala de estudo
- 14 salas disponíveis em vários blocos e andares
- Calendário dinâmico (mês atual gerado em tempo real)
- Bloqueio de fins de semana e dias passados
- Visualização de horários já reservados (cinza tachado)
- Validação contra reservas duplicadas
- Notificação automática ao confirmar

### 📚 Biblioteca
- Lista de livros emprestados ao usuário
- Acervo navegável com 6 livros disponíveis
- Empréstimo com prazo automático de 15 dias
- Devolução em um toque
- Notificação dinâmica quando faltam ≤5 dias

### 🔔 Notificações e atividades
- Registro automático de reservas e empréstimos
- Long press para apagar notificações
- Histórico permanente de atividades

---

## Pré-requisitos

### Software necessário

| Programa | Versão mínima | Link |
|---|---|---|
| **Node.js** | 18+ | https://nodejs.org/ |
| **Git** | qualquer | https://git-scm.com/downloads |
| **MySQL Server** | 8+ | https://dev.mysql.com/downloads/installer/ |
| **Android Studio** | atual | https://developer.android.com/studio |

### Recomendado (opcional)
- **MySQL Workbench** — vem junto com o instalador do MySQL
- **VSCode** — para visualizar/editar o código

---

## Setup completo (do zero)

> ⚠️ Siga os passos **em ordem**. Cada parte depende da anterior.

### Parte 1 — Instalar pré-requisitos

#### 1.1 Node.js
1. Baixe a versão **LTS** em https://nodejs.org/
2. Instale com as opções padrão.
3. Abra um terminal e confirme:
```bash
   node --version
   npm --version
```

#### 1.2 Git
1. Baixe em https://git-scm.com/downloads
2. Instale com as opções padrão.
3. Confirme: `git --version`

#### 1.3 MySQL Server
1. Baixe o **MySQL Installer** em https://dev.mysql.com/downloads/installer/
   (Escolha a versão "offline" — ~400 MB — é mais confiável)
2. Durante a instalação, escolha **"Developer Default"** (instala Server, Workbench, etc.)
3. Na fase de configuração do servidor:
   - **Type and Networking:** "Development Computer", TCP/IP, porta `3306`
   - **Authentication Method:** "Use Strong Password Encryption"
   - **Root Password:** defina uma senha e **ANOTE EM ALGUM LUGAR SEGURO**
   - **Windows Service:** "MySQL80", inicia com o sistema
4. Confirme que o serviço está rodando:
   - Abra "Serviços" do Windows → procure **MySQL80** → status deve ser "Em execução"
5. Abra o **MySQL Workbench** e teste a conexão local:
   - Clique na conexão "Local instance MySQL80"
   - Use a senha do root
   - Se aparecer "Connection Succeeded", está OK

#### 1.4 Android Studio
1. Baixe em https://developer.android.com/studio
2. Instale com os componentes padrão (Android SDK + SDK Tools).
3. Após instalado, abra e configure um emulador:
   - **Tools** → **Device Manager** → **Create Device**
   - Escolha um modelo: **Pixel 5** ou **Medium Phone** (recomendados)
   - Imagem do sistema: **Android 13 (API 33)** ou superior
   - Finalize e clique no botão ▶️ pra iniciar o emulador
4. Deixe o emulador rodando.

---

### Parte 2 — Clonar o projeto

Em qualquer pasta de trabalho:

```bash
git clone https://github.com/alu180/projeto-pi.git
cd projeto-pi
```

> ℹ️ Apesar do nome do repo ser `projeto-pi`, ele contém os dois projetos (frontend e backend) como monorepo.

---

### Parte 3 — Configurar e rodar o backend

#### 3.1 Criar o banco vazio
Abra o **MySQL Workbench** e execute:

```sql
CREATE DATABASE sinapse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Confira no painel esquerdo (SCHEMAS) que o database `sinapse` apareceu vazio.

#### 3.2 Configurar conexão

```bash
cd sinapse-api
```

Copie o template:

```bash
# Windows (PowerShell):
copy .env.example .env

# Linux/Mac:
cp .env.example .env
```

Abra `sinapse-api/.env` em qualquer editor e troque `SUA_SENHA` pela senha real do seu root MySQL.

Exemplo:
```env
DATABASE_URL="mysql://root:minhasenha123@localhost:3306/sinapse"
```

#### 3.3 Instalar dependências

```bash
npm install
```

#### 3.4 Criar tabelas e popular dados iniciais

```bash
npm run setup
```

Esse comando faz duas coisas:
- Aplica as **migrations** do Prisma (cria todas as tabelas no banco)
- Roda o **seed** (popula com 1 usuário, 14 salas, 8 livros e atividades iniciais)

Confira no Workbench: clique em `sinapse` no painel SCHEMAS, expanda "Tables". Devem aparecer 6 tabelas (usuarios, salas, livros, notificacoes, atividades, reservas).

#### 3.5 Subir o servidor

```bash
npm run dev
```

Deve aparecer: API Sinapse rodando em http://localhost:3000

Teste no navegador do PC: http://localhost:3000/salas — deve retornar JSON com as 14 salas.

> 🔴 **Deixe esse terminal aberto** com o backend rodando.

---

### Parte 4 — Configurar e rodar o frontend

Abra **outro terminal** (NÃO feche o do backend).

#### 4.1 Instalar dependências
```bash
cd projeto-pi
npm install
```

#### 4.2 Garantir que o emulador Android está aberto
Confirme que o emulador do Android Studio está rodando (você abriu na Parte 1.4).

#### 4.3 Iniciar o Expo
```bash
npx expo start
```

Aguarde o Metro Bundler subir (alguns segundos).

#### 4.4 Abrir no emulador
Quando o Expo mostrar o menu, pressione **`a`** no teclado pra abrir no emulador Android.

> 💡 Se o Expo perguntar se quer atualizar a versão do Expo Go, **responda `n`** (não). A versão atual funciona.

Na primeira vez, o app vai baixar o Expo Go no emulador e compilar (pode levar 2-3 minutos). Depois abre a tela de Login do Sinapse.

---

## Roteiro de testes

Use este roteiro pra validar que **todas as funcionalidades** estão funcionando. Faça na ordem.

### Credenciais de teste pré-cadastradas
- **Usuário:** `aluno`
- **Senha:** `1234`

---

### ✅ Teste 1 — Login válido
**Como fazer:**
1. Na tela de Login, digite `aluno` / `1234`.
2. Aperte "entrar".

**Esperado:**
- Carregamento por meio segundo.
- Navega para a Home (Notificações).
- No header: nome "Aluno com um sobrenome de aluno", matrícula 202312345, curso "Ciência da Computação", instituição "IESB".

---

### ✅ Teste 2 — Login inválido
**Como fazer:**
1. Faça logout (botão preto/vermelho na BottomNav).
2. Tente entrar com `aluno` / `senhaerrada`.

**Esperado:**
- Alert "Falha no login — Usuário ou senha inválidos".
- Continua na tela de Login.

---

### ✅ Teste 3 — Cadastro de nova conta
**Como fazer:**
1. Na tela de Login, aperte **"Criar conta"**.
2. Preencha:
   - Nome: `Maria Silva`
   - Usuário: `maria`
   - Senha: `1234`
   - Confirmar senha: `1234`
   - Matrícula: `202499999`
   - Curso: `Engenharia`
   - Instituição: `IESB`
3. Aperte "criar conta".

**Esperado:**
- Carregamento por meio segundo.
- Vai direto pra Home (auto-login).
- Header mostra: "Maria Silva", matrícula 202499999, curso "Engenharia", instituição "IESB".

---

### ✅ Teste 4 — Validações do cadastro
**Como fazer:**
1. Faça logout, vá pra "Criar conta".
2. Tente cadastrar com senhas diferentes nos dois campos.

**Esperado:** Texto vermelho "Senhas não coincidem".

3. Corrija e tente cadastrar com usuário muito curto (1-2 caracteres).

**Esperado:** Texto vermelho "Usuário deve ter pelo menos 3 caracteres".

4. Tente cadastrar com username `aluno` (que já existe).

**Esperado:** Alert "Falha no cadastro — Esse nome de usuário já está em uso".

---

### ✅ Teste 5 — Reserva de sala (fluxo completo)
**Como fazer:**
1. Logado, aperte o ícone de **capelo** na BottomNav (Sala de Estudo).
2. Aguarde a lista carregar — devem aparecer 14 salas.
3. Toque em **"Sala CB1"**.
4. No calendário, escolha um **dia útil futuro** (ex: dia 8 se hoje é dia 6).
5. Aperte o **✓** no canto superior direito.
6. Na tela de horários, escolha **"15h30"**.
7. Aperte o **✓**.

**Esperado:**
- Cada tela mostra `ActivityIndicator` brevemente.
- Alert "Reserva Confirmada! Sala CB1 — DD/MM/2026 às 15h30".
- Vai pra Home.
- Notificação nova aparece: "Reserva Confirmada — Sala CB1 reservada para DD/MM/2026 às 15h30."
- Nova atividade em "Registro de Atividade".

---

### ✅ Teste 6 — Bloqueio de reserva duplicada
**Como fazer:**
1. Sem deslogar, repita o Teste 5 com exatamente os mesmos dados (CB1, mesmo dia, 15h30).

**Esperado:**
- Alert "Falha na reserva — Você já reservou esta sala para este dia e horário."
- Não cria duplicata.

---

### ✅ Teste 7 — Horários ocupados aparecem cinza
**Como fazer:**
1. Vá pra Sala de Estudo de novo → CB1 → mesmo dia.
2. Olhe a tabela de horários.

**Esperado:**
- Legenda no topo: "Disponível", "Selecionado", "Ocupado".
- O slot **15h30** aparece em cinza, tachado, em itálico.
- Não é possível selecionar 15h30.

---

### ✅ Teste 8 — Bloqueio de fins de semana
**Como fazer:**
1. Vá pra Sala de Estudo → escolha qualquer sala → calendário.
2. Tente clicar num **sábado** ou **domingo** (números em vermelho).

**Esperado:** O clique não funciona, o dia não fica selecionado.

---

### ✅ Teste 9 — Biblioteca: ver livros emprestados
**Como fazer:**
1. Aperte o ícone de **livro azul** na BottomNav.

**Esperado:**
- Aparecem 2 cards: "S.O.S Cálculo 1" e "Programação é legal".
- Cada um mostra autor, ID mascarado, datas de empréstimo e devolução.
- Cada card tem um botão verde **"Devolver"**.

---

### ✅ Teste 10 — Devolver um livro
**Como fazer:**
1. Na Biblioteca, aperte "Devolver" em "S.O.S Cálculo 1".
2. Confirme no Alert.

**Esperado:**
- Alert "Sucesso — Livro devolvido!"
- Card de "S.O.S Cálculo 1" some da Biblioteca.
- Volte pra Home: aparece notificação "Livro Devolvido — Você devolveu o livro 'S.O.S Cálculo 1'."
- No Registro de Atividade, a atividade do empréstimo de "S.O.S Cálculo 1" **sumiu**.

---

### ✅ Teste 11 — Acervo: pegar livro emprestado
**Como fazer:**
1. Vá pra Biblioteca → aperte **"Acervo"** no topo direito.
2. Lista deve mostrar 6 livros (Algoritmos, Estrutura de Dados, Redes, Sistemas Operacionais, Engenharia de Software, Banco de Dados Conceitual) + o "S.O.S Cálculo 1" que você devolveu.
3. Aperte "Pegar emprestado" em "Redes de Computadores".
4. Confirme.

**Esperado:**
- Alert "Sucesso! Livro adicionado à sua biblioteca."
- Vai pra Biblioteca: agora tem "Programação é legal" + "Redes de Computadores".
- Data de empréstimo é hoje, devolução é hoje + 15 dias.
- Home: nova notificação "Livro Emprestado" + nova atividade categoria "Biblioteca".

---

### ✅ Teste 12 — Long press para apagar notificação
**Como fazer:**
1. Vá pra Home.
2. **Segure pressionada** (cerca de meio segundo) uma notificação (não as amarelas de "Devolução próxima").

**Esperado:**
- Alert "Apagar notificação? Esta ação removerá '...' permanentemente."
- Botões: Cancelar | Apagar.

3. Aperte "Apagar".

**Esperado:** Notificação some imediatamente.

---

### ✅ Teste 13 — Persistência após restart do backend
**Como fazer:**
1. No terminal do backend, aperte **Ctrl+C** pra parar.
2. Rode `npm run dev` de novo.
3. No app, faça reload (ou volte pra Home e ela vai recarregar).

**Esperado:**
- Todas as reservas, livros emprestados e notificações **continuam lá**.
- Os dados não foram perdidos (porque o MySQL persiste tudo).

---

### ✅ Teste 14 — Notificação dinâmica "Devolução próxima"

Para testar essa funcionalidade sem esperar 10 dias, vamos forçar a data de devolução pra perto.

**Como fazer:**
1. No MySQL Workbench, execute:
```sql
   UPDATE sinapse.livros 
   SET devolucao = CONCAT(DAY(CURRENT_DATE + INTERVAL 3 DAY), '/', 
                          LPAD(MONTH(CURRENT_DATE), 2, '0'), '/',
                          YEAR(CURRENT_DATE))
   WHERE obra = 'Programação é legal';
```
   (Isso muda a devolução pra daqui a 3 dias.)
2. No app, recarregue a Home.

**Esperado:**
- Aparece notificação amarela "Devolução próxima" no topo da lista, mencionando "Programação é legal" e a data nova.

---

### ✅ Teste 15 — Resetar tudo (opcional)
Se quiser limpar e voltar ao estado inicial:

```bash
cd sinapse-api
npm run db:reset
```

Recria o banco e popula com os dados originais do seed.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autentica usuário |
| POST | `/usuarios` | Cadastra novo usuário |
| GET | `/salas` | Lista todas as salas |
| GET | `/salas/:id/disponibilidade?mes=N&ano=N` | Dias indisponíveis do mês |
| GET | `/salas/:id/horarios?dia=N&mes=N&ano=N` | Horários ocupados do dia |
| GET | `/livros/:userId` | Livros emprestados do usuário |
| GET | `/livros/disponiveis/lista` | Livros disponíveis no acervo |
| PUT | `/livros/:id/emprestar` | Emprestar livro |
| PUT | `/livros/:id/devolver` | Devolver livro |
| GET | `/notificacoes/:userId` | Notificações do usuário |
| DELETE | `/notificacoes/:id` | Apagar notificação |
| GET | `/atividades/:userId` | Atividades do usuário |
| GET | `/reservas/:userId` | Reservas do usuário |
| POST | `/reservas` | Criar reserva |
| DELETE | `/reservas/:id` | Cancelar reserva |

---

## Problemas comuns

### Backend não sobe — "Can't reach database server at localhost:3306"
- MySQL não está rodando. Abra **Serviços do Windows** → procure **MySQL80** → "Iniciar".

### "Authentication failed against database server"
- Senha errada no `.env`. Confira `DATABASE_URL` em `sinapse-api/.env`.
- Reinicie o backend depois de editar o `.env`.

### `npm install` falha com EBUSY no Windows
- Provavelmente é Dropbox ou OneDrive tentando sincronizar `node_modules`.
- Pause o sync do Dropbox/OneDrive antes de instalar.

### App diz "Network Error" ao logar
- Backend não está rodando OU `services/api.js` aponta pra URL errada.
- Confira que o backend está em `http://localhost:3000` (teste no navegador do PC).
- Confira que `projeto-pi/services/api.js` tem `BASE_URL = 'http://10.0.2.2:3000'` (que é o IP mágico do emulador Android Studio).

### Emulador Android lento ou não abre
- Habilite virtualização na BIOS do PC (VT-x / AMD-V).
- Aumente RAM do emulador: no Android Studio, Device Manager → Editar → Show Advanced Settings → RAM 2048 MB+.

### "Cannot find module '@prisma/client'"
- Rode `npx prisma generate` na pasta `sinapse-api` e reinicie o backend.

### Quero começar tudo do zero
```bash
cd sinapse-api
npm run db:reset
```
Apaga todas as tabelas, recria via migrations e roda o seed novamente.

---

## Equipe

- **Aluisio** — [@alu180](https://github.com/alu180)
- **Miguel** — Dupla

---

## Disciplina

Projeto Integrador 3 (PI3A) — Ciência da Computação — IESB — 2026/1