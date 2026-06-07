# Sinapse — Frontend (App Mobile)

App mobile do projeto **Sinapse**, construído com React Native + Expo.

> ℹ️ Para a visão geral do projeto, veja o [README principal](../README.md).
> Para o backend, veja [sinapse-api/README.md](../sinapse-api/README.md).

---

## Stack

- React Native 0.83.2
- Expo 55.0.5
- React Navigation (Stack)
- Axios
- AsyncStorage (Expo)

---

## Pré-requisitos

- **Node.js** 18+
- **Android Studio** com emulador configurado (ou Expo Go no celular)
- **Backend rodando** em `http://localhost:3000` — veja [sinapse-api](../sinapse-api/README.md)

---

## Como rodar

### 1. Instalar dependências

```bash
cd projeto-pi
npm install
```

### 2. Subir o Expo

```bash
npx expo start
```

### 3. Abrir o app

- **Emulador Android Studio:** pressione `a` no terminal do Expo
- **Celular físico:** escaneie o QR code com o Expo Go (precisa ajustar a URL da API)

---

## Configuração da URL da API

O arquivo `services/api.js` define onde o app vai buscar dados:

```javascript
const BASE_URL = 'http://10.0.2.2:3000';  // Emulador Android Studio
```

| Cenário | URL |
|---|---|
| Emulador Android Studio | `http://10.0.2.2:3000` (atual) |
| Celular físico (Expo Go) | `http://<SEU_IP_LOCAL>:3000` (descubra com `ipconfig`) |
| Emulador iOS | `http://localhost:3000` |

---

## Estrutura do projeto

projeto-pi/
├── App.js                   # Configuração de rotas (Stack Navigator)
├── index.js                 # Entry point Expo
├── paginas/                 # Telas
│   ├── Pag_login.js
│   ├── Pag_cadastro.js
│   ├── Pag_notificacoes.js  # Home
│   ├── Pag_biblioteca.js
│   ├── Pag_acervo.js
│   ├── Pag_sala_estudo.js
│   ├── Pag_calendario.js
│   └── Pag_horarios.js
├── components/              # Componentes reutilizáveis
│   ├── Header.js
│   ├── BottomNav.js
│   ├── TituloPagina.js
│   └── cores.js             # Paleta de cores
├── contextos/
│   └── auten_usuario.js     # Contexto de autenticação + AsyncStorage
├── hooks/
│   └── User_login.js        # Hook customizado do formulário de login
├── services/
│   └── api.js               # Instância configurada do axios
└── assets/                  # Ícones e splash

---

## Telas

| Tela | Arquivo | Função |
|---|---|---|
| Login | `Pag_login.js` | Entrada no app + link para cadastro |
| Cadastro | `Pag_cadastro.js` | Criar conta nova com auto-login |
| Home | `Pag_notificacoes.js` | Notificações + Registro de atividade |
| Biblioteca | `Pag_biblioteca.js` | Livros emprestados (com botão Devolver) |
| Acervo | `Pag_acervo.js` | Livros disponíveis para empréstimo |
| Sala de Estudo | `Pag_sala_estudo.js` | Lista de salas |
| Calendário | `Pag_calendario.js` | Escolha do dia da reserva |
| Horários | `Pag_horarios.js` | Escolha do horário + confirma reserva |

---

## Credenciais de teste

- **Usuário:** `aluno`
- **Senha:** `1234`

Ou crie sua própria conta pelo botão "Criar conta" na tela de login.

---

## Comandos úteis

```bash
npx expo start              # Inicia Expo
npx expo start --android    # Abre direto no emulador Android
npx expo start --tunnel     # Usa tunnel se a rede do PC bloqueia
```