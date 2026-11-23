import { memo } from 'react'
import EmptyState from './EmptyState'
import styles from './TransactionTable.module.css'

/**
 * Formata valor monetário em BRL.
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

/**
 * Formata data ISO para dd/mm/aaaa.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('pt-BR')
}

/**
 * TransactionTable — tabela de transações financeiras.
 *
 * Props:
 *  - transactions:  Array
 *  - loading:       boolean
 *  - onEdit:        (transaction) => void
 *  - onDelete:      (transaction) => void
 *  - pagination:    { page, totalPages, total }
 *  - onPageChange:  (page) => void
 */
const TransactionTable = memo(function TransactionTable({
  transactions = [],
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}) {
  /* ── Skeleton rows ── */
  if (loading && !transactions.length) {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Data</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j}>
                    <div className={styles.skeletonCell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  /* ── Empty state ── */
  if (!loading && !transactions.length) {
    return (
      <EmptyState
        icon="📋"
        title="Nenhuma transação encontrada"
        message="Tente ajustar os filtros ou cadastre sua primeira transação."
      />
    )
  }

  /* ── Paginação ── */
  const totalPages = pagination?.totalPages ?? 1
  const currentPage = pagination?.page ?? 1
  const total = pagination?.total ?? transactions.length

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Data</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <span className={styles.desc}>{tx.description || '—'}</span>
                </td>
                <td>
                  <span className={styles.category}>{tx.category || '—'}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      tx.type === 'income' ? 'badge-income' : 'badge-expense'
                    }`}
                  >
                    {tx.type === 'income' ? '↑ Receita' : '↓ Despesa'}
                  </span>
                </td>
                <td>{formatDate(tx.date ?? tx.createdAt)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span
                    className={
                      tx.type === 'income' ? styles.valueIncome : styles.valueExpense
                    }
                  >
                    {tx.type === 'expense' ? '−' : '+'} {formatCurrency(tx.amount)}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        onClick={() => onEdit(tx)}
                        title="Editar"
                        type="button"
                        aria-label={`Editar ${tx.description}`}
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        onClick={() => onDelete(tx)}
                        title="Excluir"
                        type="button"
                        aria-label={`Excluir ${tx.description}`}
                        style={{ color: 'var(--danger)' }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            {total} transação{total !== 1 ? 'ões' : ''} no total
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              aria-label="Página anterior"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
              )
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="pagination-btn" style={{ cursor: 'default', opacity: 0.4 }}>…</span>
                  )}
                  <button
                    key={p}
                    className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(p)}
                    disabled={loading}
                    aria-label={`Página ${p}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                </>
              ))}

            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              aria-label="Próxima página"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  )
})

export default TransactionTable
