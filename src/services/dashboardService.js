import api from './api'

/**
 * dashboardService.js — Serviço de dados do dashboard.
 *
 * Endpoints esperados no Backend:
 *   GET /dashboard → {
 *     data: {
 *       balance:           number,  // saldo atual
 *       totalIncome:       number,  // total receitas
 *       totalExpenses:     number,  // total despesas
 *       transactionCount:  number,  // quantidade de transações
 *       monthlyEvolution:  Array<{ month: string, income: number, expenses: number }>,
 *       categoryBreakdown: Array<{ category: string, amount: number, percentage: number }>,
 *     }
 *   }
 *
 * Parâmetros opcionais: ?period=30d|90d|6m|1y
 */

/**
 * Busca dados resumidos do dashboard.
 * @param {string} period - '30d' | '90d' | '6m' | '1y' (padrão: '30d')
 * @returns {Promise<object>}
 */
export async function getDashboardData(period = '30d') {
  const response = await api.get('/dashboard', { params: { period } })
  const payload = response.data?.data ?? response.data

  // Garante estrutura mínima para evitar crashes no componente
  return {
    balance:           payload?.balance           ?? 0,
    totalIncome:       payload?.totalIncome        ?? 0,
    totalExpenses:     payload?.totalExpenses      ?? 0,
    transactionCount:  payload?.transactionCount   ?? 0,
    monthlyEvolution:  payload?.monthlyEvolution   ?? [],
    categoryBreakdown: payload?.categoryBreakdown  ?? [],
  }
}
