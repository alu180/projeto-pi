# Sinapse

Aplicativo em React Native com Expo voltado para acessibilidade no contexto academico. O projeto possui telas de login, notificacoes, biblioteca, sala de estudo, calendario e horarios de reserva.

## Funcionalidades atuais

- Login com validacao de usuario e senha.
- Tela inicial com notificacoes e registro de atividade.
- Consulta de livros na biblioteca.
- Selecao de sala de estudo.
- Escolha de dia disponivel no calendario.
- Escolha de horario para reserva.
- Navegacao inferior entre as telas principais.

## Como usar o app

1. Abra o app.
2. Na tela de login, preencha usuario e senha.
3. Toque em `entrar`.
4. Use o menu inferior para navegar entre `Home`, `Biblioteca` e `Sala de Estudo`.
5. Na area de sala de estudo:
   - escolha uma sala;
   - selecione um dia;
   - escolha um horario;
   - confirme a reserva.
6. Para sair, toque no botao preto com icone de energia no menu inferior.

## Observacao sobre login

Atualmente o login esta simulado para desenvolvimento. Qualquer usuario e qualquer senha nao vazios permitem entrar no app.

## Requisitos

- Node.js instalado.
- npm instalado.
- Expo executado com `npx`.
- App `Expo Go` instalado no celular, se quiser testar no dispositivo movel.

## Como rodar localmente

Abra um terminal na pasta do projeto:

```powershell
cd caminho/para/o/projeto
```

Instale as dependencias:

```powershell
npm install
```

### Rodar com Expo

```powershell
npx expo start
```

Depois:

- abra o `Expo Go` no celular;
- escaneie o QR Code exibido no terminal ou no navegador;
- mantenha o computador e o celular na mesma rede, se necessario.

### Outros comandos uteis

```powershell
npm run start
npm run android
npm run ios
```

## Estrutura principal

- `App.js`: configuracao das rotas e navegacao.
- `paginas/`: telas do aplicativo.
- `components/`: componentes reutilizaveis.
- `contextos/`: contexto de autenticacao.
- `hooks/`: logica auxiliar de formulario e estado.
- `assets/`: arquivos estaticos.

## Tecnologias usadas

- React Native
- Expo
- React Navigation
- Async Storage

## Observacoes de desenvolvimento

- O estado de autenticacao e salvo localmente com `AsyncStorage`.
- A navegacao principal usa `@react-navigation/stack`.
