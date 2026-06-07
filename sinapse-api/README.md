# Sinapse API

Backend REST do projeto **Sinapse** — aplicativo de reservas de sala de estudo e gerenciamento de biblioteca do IESB.

**Stack:** Node.js • Express • Prisma ORM • MySQL

---

## Pré-requisitos

- **Node.js** 18+ ([baixar](https://nodejs.org/))
- **MySQL Server** 8+ ([baixar](https://dev.mysql.com/downloads/installer/))
- (Opcional) **MySQL Workbench** para visualizar o banco

---

## Setup inicial (primeira vez)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repo>
cd sinapse-api
npm install
```

### 2. Criar o banco vazio

Abra o MySQL Workbench (ou linha de comando do MySQL) e rode:

```sql
CREATE DATABASE sinapse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar conexão

Copie o arquivo de exemplo:

```bash
# Windows (PowerShell):
copy .env.example .env

# Linux/Mac:
cp .env.example .env
```

Abra o `.env` e substitua `SUA_SENHA` pela senha do seu root MySQL.

### 4. Criar tabelas + popular dados

```bash
npm run setup
```

Isso roda as migrations (`prisma migrate deploy`) e o seed (`prisma db seed`) em sequência.

### 5. Subir o servidor

```bash
npm run dev
```

Servidor sobe em `http://localhost:3000`.

---

## Comandos úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe servidor com auto-reload (desenvolvimento) |
| `npm start` | Sobe servidor sem auto-reload (produção) |
| `npm run setup` | Migration + seed (primeira execução) |
| `npm run db:seed` | Apenas popula dados iniciais |
| `npm run db:reset` | **Apaga e recria** o banco (cuidado!) |
| `npm run db:studio` | Abre Prisma Studio em `http://localhost:5555` |
| `npm run db:migrate` | Aplica migrations pendentes |

---

## Credenciais de teste

Após rodar o seed, existe um usuário pronto pra usar:

- **Username:** `aluno`
- **Senha:** `1234`

---

## Rotas da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autentica usuário (body: `{ username, password }`) |

### Salas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/salas` | Lista todas as salas |
| GET | `/salas/:id/disponibilidade?mes=N&ano=N` | Dias indisponíveis no mês |

### Biblioteca

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros/:userId` | Lista livros emprestados pro usuário |

### Notificações e Atividades

| Método | Rota | Descrição |
|---|---|---|
| GET | `/notificacoes/:userId` | Lista notificações do usuário |
| GET | `/atividades/:userId` | Lista atividades do usuário |

### Reservas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/reservas/:userId` | Lista reservas do usuário |
| POST | `/reservas` | Cria nova reserva (body: `{ userId, salaId, dia, mes, ano, horario }`) |
| DELETE | `/reservas/:id` | Cancela uma reserva |

---

## Estrutura do projeto

sinapse-api/
├── prisma/
│   ├── schema.prisma       # Modelagem dos dados
│   ├── seed.js             # Script de dados iniciais
│   └── migrations/         # Histórico de migrations (versionado no Git)
├── server.js               # Servidor Express + rotas
├── package.json
├── .env                    # Credenciais (NÃO versionado)
└── .env.example            # Template de credenciais (versionado)

---

## Conexão com o app React Native

O app React Native (`projeto-pi/`) consome essa API. Configurações no arquivo `projeto-pi/services/api.js`:

- **Emulador Android Studio:** `http://10.0.2.2:3000`
- **Celular físico:** `http://<seu-ip-local>:3000` (descubra com `ipconfig`)

---

## Problemas comuns

### "Can't reach database server"
MySQL não está rodando. No Windows: Serviços → procure `MySQL80` → Iniciar.

### "Authentication failed against database server"
Senha errada no `.env`. Confira `DATABASE_URL`. Reinicie o servidor após editar.

### "Cannot find module '@prisma/client'"
Rode `npx prisma generate` e reinicie.

### Tudo bagunçado, quero começar do zero
```bash
npm run db:reset
```
Apaga tudo, refaz migrations e seed.