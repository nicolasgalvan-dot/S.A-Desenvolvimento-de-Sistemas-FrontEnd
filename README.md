# FinTech Flow — Frontend

> Sistema de gestão financeira pessoal com controle de receitas, despesas e dashboard analítico.

## 🚀 Como rodar (backend + frontend) — passo a passo

O frontend depende da API do backend. Suba os dois projetos em terminais separados:

- Backend: `SA-DesenvolvimentoDeSistemas-Backend` → http://localhost:3333
- Frontend: `S.A-Desenvolvimento-de-Sistemas-FrontEnd` → http://localhost:5173

### Pré-requisitos
- Node.js 18+ e npm
- Backend do FinTech Flow configurado com PostgreSQL e rodando

### 1. Instale as dependências nos dois projetos

```bash
# Backend
cd SA-DesenvolvimentoDeSistemas-Backend
npm install

# Frontend (outro terminal)
cd S.A-Desenvolvimento-de-Sistemas-FrontEnd
npm install
```

### 2. Configure o `.env` do backend

No backend, copie `.env.example` para `.env` e ajuste principalmente:

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/fintech_flow?schema=public"
JWT_SECRET="troque-por-uma-chave-secreta"
CORS_ORIGIN=http://localhost:5173
```

Em seguida, prepare o banco e inicie a API:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Confira em http://localhost:3333/api/health (retorno `{"status":"OK"}`) ou na documentação Swagger em http://localhost:3333/api/docs.

### 3. Configure o `.env` do frontend

Na raiz do frontend:

```env
VITE_API_URL=http://localhost:3333/api
```

> Após alterar o `.env`, reinicie o Vite.

### 4. Inicie o frontend

```bash
npm run dev
```

Acesse http://localhost:5173. A aplicação redireciona para `/login`.

### 5. Teste a integração

1. Clique em **Criar conta gratuita**, preencha nome, e-mail e senha (mínimo 6 caracteres).
2. Faça login com o usuário criado — você será levado ao `/dashboard`.
3. Clique em **+ Nova transação** e cadastre uma receita e uma despesa.
4. Confira os cards (**Saldo Atual**, **Total de Receitas**, **Total de Despesas**, **Transações**), os gráficos e a aba **Transações**.
5. Para testar a API isoladamente, use o Swagger do backend: faça login, copie o token e clique em **Authorize** com `Bearer <token>`.

### Problemas comuns
- Cards zerados / erro ao carregar dados: confirme `VITE_API_URL` e se o backend está rodando.
- Erro de CORS no console: confirme `CORS_ORIGIN` no `.env` do backend e reinicie a API.
- 401 redirecionando para o login: token expirado — faça login novamente.

## Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 19 |
| Vite | 8 |
| JavaScript | ES2024 |
| Axios | 1.7+ |
| React Router DOM | 7 |
| Recharts | 2 |

## Pré-requisitos

- Node.js **18+**
- npm ou yarn
- Backend do FinTech Flow rodando localmente

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositório>
cd S.A-Desenvolvimento-de-Sistemas-FrontEnd

# Instale as dependências
npm install
```

## Configuração

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# URL base da API Backend
VITE_API_URL=http://localhost:3333/api
```

> Ajuste a porta conforme a configuração do seu backend.

## Executar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## Build de produção

```bash
npm run build
```

Os arquivos de build serão gerados em `dist/`.

## Preview do build

```bash
npm run preview
```

## Estrutura de pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Navbar.jsx
│   ├── StatCard.jsx
│   ├── TransactionTable.jsx
│   ├── TransactionForm.jsx
│   ├── FilterBar.jsx
│   ├── Modal.jsx
│   ├── Loader.jsx
│   └── EmptyState.jsx
├── contexts/
│   ├── AuthContext.jsx     # Autenticação JWT global
│   └── ToastContext.jsx    # Notificações globais
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx       # Dashboard principal
├── routes/
│   └── PrivateRoute.jsx    # Proteção de rotas privadas
├── services/
│   ├── api.js              # Instância Axios configurada
│   ├── transactionService.js
│   └── dashboardService.js
├── App.jsx
├── main.jsx
└── style.css               # Design system global
```

## Endpoints do Backend utilizados

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação |
| POST | `/auth/register` | Cadastro |
| GET | `/dashboard` | Dados do dashboard |
| GET | `/transactions` | Listar transações (com filtros e paginação) |
| POST | `/transactions` | Criar transação |
| PUT | `/transactions/:id` | Atualizar transação |
| DELETE | `/transactions/:id` | Excluir transação |

## Funcionalidades

- **Autenticação**: login, cadastro, logout, persistência de sessão via JWT
- **Dashboard**: saldo, receitas, despesas, contagem de transações, gráficos de área, barra e pizza
- **Transações**: listagem, criação, edição, exclusão com confirmação
- **Filtros**: busca por descrição, tipo (receita/despesa), período
- **Paginação**: suporte à paginação do backend
- **UX**: toasts de feedback, estados de carregamento (skeleton), estados vazios, modais de confirmação
- **Responsivo**: funciona em desktop, tablet e celular
