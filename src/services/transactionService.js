import api from './api'

/**
 * transactionService.js — Serviço de transações financeiras.
 *
 * Endpoints esperados no Backend (http://localhost:3333/api):
 *   GET    /transactions          → { data: { transactions, pagination } }
 *   POST   /transactions          → { data: transaction }
 *   PUT    /transactions/:id      → { data: transaction }
 *   DELETE /transactions/:id      → { message: string }
 *
 * Formato da API: { id, title, amount, type: 'INCOME'|'EXPENSE', createdAt }
 * Formato usado na UI: { id, description, amount, type: 'income'|'expense', ... }
 * A conversão entre os dois é feita por toApiPayload/fromApiTransaction.
 *
 * Parâmetros de busca (GET /transactions):
 *   page, limit, type, search, startDate, endDate
 */

/**
 * Converte o formato do formulário (description/type minúsculo) para o
 * contrato da API (title/type maiúsculo). Campos sem suporte no backend
 * (category/date) são removidos para não falhar na validação Joi.
 */
function toApiPayload(data = {}) {
  return {
    title: data.title ?? data.description,
    amount: data.amount,
    type: String(data.type ?? '').toUpperCase(),
  }
}

/**
 * Converte a resposta da API para o formato usado pela tabela/formulário.
 */
function fromApiTransaction(tx = {}) {
  const type = String(tx.type ?? '').toLowerCase()
  return {
    ...tx,
    description: tx.description ?? tx.title ?? '',
    category: tx.category ?? '',
    type: type === 'income' || type === 'expense' ? type : '',
  }
}

/**
 * Lista transações com filtros e paginação.
 * @param {object} params - Parâmetros de busca
 * @returns {Promise<{ transactions: Array, pagination: object }>}
 */
export async function getTransactions(params = {}) {
  // Remove parâmetros vazios para não poluir a query string
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )

  const response = await api.get('/transactions', { params: cleanParams })

  // Suporta tanto { data: { transactions, pagination } } quanto { transactions, pagination }
  const payload = response.data?.data ?? response.data
  return {
    transactions: (payload?.transactions ?? payload ?? []).map(fromApiTransaction),
    pagination: payload?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
  }
}

/**
 * Cria uma nova transação.
 * @param {object} data - { description, amount, type, category, date }
 * @returns {Promise<object>} Transação criada
 */
export async function createTransaction(data) {
  const response = await api.post('/transactions', toApiPayload(data))
  return fromApiTransaction(response.data?.data ?? response.data)
}

/**
 * Atualiza uma transação existente.
 * @param {number|string} id
 * @param {object} data - Campos a atualizar
 * @returns {Promise<object>} Transação atualizada
 */
export async function updateTransaction(id, data) {
  const response = await api.put(`/transactions/${id}`, toApiPayload(data))
  return fromApiTransaction(response.data?.data ?? response.data)
}

/**
 * Remove uma transação.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`)
}

/**
 * Categorias padrão disponíveis no sistema.
 * Usado para popular os selects de categoria.
 */
export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Dividendos',
  'Outros',
]

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Comunicação',
  'Seguros',
  'Outros',
]

export function getCategoriesByType(type) {
  if (type === 'income') return INCOME_CATEGORIES
  if (type === 'expense') return EXPENSE_CATEGORIES
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
}
