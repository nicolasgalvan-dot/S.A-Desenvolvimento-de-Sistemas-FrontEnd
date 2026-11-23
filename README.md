# FinTech Flow — Frontend

> Sistema de gestão financeira pessoal com controle de receitas, despesas e dashboard analítico.

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
