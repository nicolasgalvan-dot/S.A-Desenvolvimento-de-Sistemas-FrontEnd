import api from './api'

/**
 * dashboardService.js — Serviço de dados do dashboard.
 *
 * O backend responde GET /dashboard com:
 *   {
 *     data: {
 *       totals: { income, expense, balance, transactionCount },
 *       monthlyEvolution: [{ month, income, expense, balance }],
 *       distribution: { income, expense },
 *       recentTransactions: [...],
 *     }
 *   }
 *
 * Este serviço converte essa resposta para o formato usado pelo Dashboard.jsx.
 */

/**
 * Busca dados resumidos do dashboard.
 * @param {string} period - '30d' | '90d' | '6m' | '1y' (padrão: '30d')
 * @returns {Promise<object>}
 */
export async function getDashboardData(period = '30d') {
  const response = await api.get('/dashboard', { params: { period } })
  const payload = response.data?.data ?? response.data
  const totals = payload?.totals ?? payload ?? {}

  return {
    balance:          totals.balance          ?? 0,
    totalIncome:      totals.income           ?? 0,
    totalExpenses:    totals.expense          ?? 0,
    transactionCount: totals.transactionCount ?? 0,

    // O backend envia "expense" (singular); o gráfico usa "expenses".
    monthlyEvolution: (payload?.monthlyEvolution ?? []).map((item) => ({
      month: item.month,
      income: item.income ?? 0,
      expenses: item.expenses ?? item.expense ?? 0,
    })),

    // O modelo de dados não possui campo de categoria; o backend não fornece
    // esse agrupamento, então o gráfico exibe seu estado vazio.
    categoryBreakdown: payload?.categoryBreakdown ?? [],
  }
}
