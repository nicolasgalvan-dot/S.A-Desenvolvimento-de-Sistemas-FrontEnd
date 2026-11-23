import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getDashboardData } from '../services/dashboardService'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService'
import StatCard       from '../components/StatCard'
import TransactionTable from '../components/TransactionTable'
import TransactionForm  from '../components/TransactionForm'
import FilterBar        from '../components/FilterBar'
import Modal, { ConfirmModal } from '../components/Modal'
import Loader           from '../components/Loader'
import styles           from './Dashboard.module.css'

/* ── Helpers ────────────────────────────────────────────── */
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val ?? 0)
}

const CHART_COLORS = {
  income:   '#057a55',
  expenses: '#e02424',
  balance:  '#1a56db',
}

const PIE_COLORS = [
  '#1a56db','#e02424','#057a55','#d97706','#7c3aed',
  '#db2777','#0891b2','#65a30d','#dc2626','#9333ea',
]

/* ── Componente principal ───────────────────────────────── */
function Dashboard() {
  const { user }  = useAuth()
  const toast     = useToast()

  /* ── Estado: dashboard ── */
  const [dashData,     setDashData]     = useState(null)
  const [dashLoading,  setDashLoading]  = useState(true)
  const [dashError,    setDashError]    = useState(null)
  const [period,       setPeriod]       = useState('30d')

  /* ── Estado: transações ── */
  const [transactions,   setTransactions]   = useState([])
  const [pagination,     setPagination]     = useState({ page: 1, totalPages: 1, total: 0 })
  const [txLoading,      setTxLoading]      = useState(false)
  const [filters,        setFilters]        = useState({ search: '', type: '', startDate: '', endDate: '' })
  const [currentPage,    setCurrentPage]    = useState(1)

  /* ── Estado: modais ── */
  const [showForm,     setShowForm]     = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formLoading,  setFormLoading]  = useState(false)
  const [deleteLoading,setDeleteLoading]= useState(false)

  /* ── Estado: aba ativa ── */
  const [activeTab, setActiveTab] = useState('overview')

  /* ── Carregar dados do dashboard ── */
  const loadDashboard = useCallback(async () => {
    setDashLoading(true)
    setDashError(null)
    try {
      const data = await getDashboardData(period)
      setDashData(data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao carregar dados do dashboard.'
      setDashError(msg)
      // Não exibe toast para erro de dashboard — mostra na tela
    } finally {
      setDashLoading(false)
    }
  }, [period])

  /* ── Carregar transações ── */
  const loadTransactions = useCallback(async () => {
    setTxLoading(true)
    try {
      const { transactions: list, pagination: pag } = await getTransactions({
        page:      currentPage,
        limit:     10,
        search:    filters.search,
        type:      filters.type,
        startDate: filters.startDate,
        endDate:   filters.endDate,
      })
      setTransactions(list)
      setPagination(pag)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao carregar transações.')
    } finally {
      setTxLoading(false)
    }
  }, [currentPage, filters, toast])

  useEffect(() => { loadDashboard() }, [loadDashboard])
  useEffect(() => { loadTransactions() }, [loadTransactions])

  /* ── Handlers de filtro ── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setCurrentPage(1)
  }, [])

  const handleFilterClear = useCallback(() => {
    setFilters({ search: '', type: '', startDate: '', endDate: '' })
    setCurrentPage(1)
  }, [])

  /* ── Handlers de formulário ── */
  const handleOpenNew = () => { setEditTarget(null); setShowForm(true) }
  const handleEdit    = (tx) => { setEditTarget(tx); setShowForm(true) }
  const handleCloseForm = () => { setShowForm(false); setEditTarget(null) }

  const handleFormSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (editTarget) {
        await updateTransaction(editTarget.id, data)
        toast.success('Transação atualizada com sucesso!')
      } else {
        await createTransaction(data)
        toast.success('Transação adicionada com sucesso!')
      }
      handleCloseForm()
      await Promise.all([loadDashboard(), loadTransactions()])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar transação.')
    } finally {
      setFormLoading(false)
    }
  }

  /* ── Handlers de exclusão ── */
  const handleDeleteRequest = (tx) => setDeleteTarget(tx)
  const handleDeleteCancel  = () => setDeleteTarget(null)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteTransaction(deleteTarget.id)
      toast.success('Transação excluída.')
      setDeleteTarget(null)
      await Promise.all([loadDashboard(), loadTransactions()])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao excluir transação.')
    } finally {
      setDeleteLoading(false)
    }
  }

  /* ── Dados memoizados para gráficos ── */
  const monthlyData   = useMemo(() => dashData?.monthlyEvolution   ?? [], [dashData])
  const categoryData  = useMemo(() => dashData?.categoryBreakdown  ?? [], [dashData])

  /* ── Render: Overview ── */
  const renderOverview = () => (
    <>
      {/* Cards de indicadores */}
      <div className="stats-grid">
        <StatCard
          title="Saldo Atual"
          value={formatCurrency(dashData?.balance)}
          icon="💰"
          loading={dashLoading}
        />
        <StatCard
          title="Total de Receitas"
          value={formatCurrency(dashData?.totalIncome)}
          icon="↑"
          variant="income"
          loading={dashLoading}
        />
        <StatCard
          title="Total de Despesas"
          value={formatCurrency(dashData?.totalExpenses)}
          icon="↓"
          variant="expense"
          loading={dashLoading}
        />
        <StatCard
          title="Transações"
          value={dashLoading ? '—' : String(dashData?.transactionCount ?? 0)}
          icon="📊"
          variant="neutral"
          loading={dashLoading}
        />
      </div>

      {/* Erro do dashboard */}
      {dashError && !dashLoading && (
        <div className="alert alert-error mb-6" role="alert">
          <span>⚠</span> {dashError} —{' '}
          <button className="btn btn-link btn-sm" onClick={loadDashboard}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Gráficos */}
      {!dashError && (
        <div className="charts-grid">
          {/* Área: evolução mensal */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Evolução Mensal</h3>
            </div>
            <div className="card-body">
              {dashLoading ? (
                <Loader size="md" label="Carregando gráfico..." />
              ) : monthlyData.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
                  Sem dados de evolução disponíveis.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CHART_COLORS.income}   stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={CHART_COLORS.income}   stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CHART_COLORS.expenses} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={CHART_COLORS.expenses} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} width={56} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Area type="monotone" dataKey="income"   name="Receitas"  stroke={CHART_COLORS.income}   fill="url(#gIncome)"   strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" name="Despesas"  stroke={CHART_COLORS.expenses} fill="url(#gExpenses)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pizza: distribuição de despesas por categoria */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Despesas por Categoria</h3>
            </div>
            <div className="card-body">
              {dashLoading ? (
                <Loader size="md" label="Carregando gráfico..." />
              ) : categoryData.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
                  Sem dados de categorias disponíveis.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ category, percentage }) =>
                        `${category} ${percentage ? `(${percentage.toFixed(0)}%)` : ''}`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de barras: comparativo mensal */}
      {!dashError && monthlyData.length > 0 && !dashLoading && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Receitas × Despesas (por mês)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} width={56} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="income"   name="Receitas" fill={CHART_COLORS.income}   radius={[4,4,0,0]} />
                <Bar dataKey="expenses" name="Despesas" fill={CHART_COLORS.expenses} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  )

  /* ── Render: Transações ── */
  const renderTransactions = () => (
    <div className="card">
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleFilterClear}
        loading={txLoading}
      />
      <TransactionTable
        transactions={transactions}
        loading={txLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        pagination={pagination}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  )

  /* ── Render principal ── */
  return (
    <div className={styles.page}>
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Olá, {user?.name?.split(' ')[0] ?? 'Usuário'} 👋
          </h1>
          <p className="page-subtitle">Aqui está o resumo das suas finanças.</p>
        </div>

        <div className={styles.headerActions}>
          {/* Seletor de período (apenas na aba overview) */}
          {activeTab === 'overview' && (
            <select
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ width: '140px' }}
              aria-label="Período do dashboard"
            >
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último ano</option>
            </select>
          )}

          <button
            className="btn btn-primary"
            onClick={handleOpenNew}
            type="button"
          >
            + Nova transação
          </button>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
          type="button"
        >
          📊 Visão Geral
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'transactions'}
          className={`${styles.tab} ${activeTab === 'transactions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('transactions')}
          type="button"
        >
          📋 Transações
          {pagination.total > 0 && (
            <span className={styles.tabBadge}>{pagination.total}</span>
          )}
        </button>
      </div>

      {/* Conteúdo por aba */}
      {activeTab === 'overview'      && renderOverview()}
      {activeTab === 'transactions'  && renderTransactions()}

      {/* Modal: adicionar / editar transação */}
      <Modal
        open={showForm}
        onClose={handleCloseForm}
        title={editTarget ? 'Editar transação' : 'Nova transação'}
        size="md"
      >
        <TransactionForm
          initialData={editTarget}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          loading={formLoading}
        />
      </Modal>

      {/* Modal: confirmar exclusão */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir transação"
        message={`Tem certeza que deseja excluir "${deleteTarget?.description}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
        loading={deleteLoading}
      />
    </div>
  )
}

export default Dashboard
