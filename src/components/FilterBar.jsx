import { useMemo } from 'react'
import styles from './FilterBar.module.css'

/**
 * FilterBar — barra de busca e filtros para a listagem de transações.
 *
 * Props:
 *  - filters:    { search, type, startDate, endDate }
 *  - onChange:   (key, value) => void
 *  - onClear:    () => void
 *  - loading:    boolean
 */
function FilterBar({ filters = {}, onChange, onClear, loading = false }) {
  const hasActiveFilters = useMemo(
    () => !!(filters.search || filters.type || filters.startDate || filters.endDate),
    [filters]
  )

  return (
    <div className={styles.bar}>
      {/* Busca por descrição */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">🔍</span>
        <input
          className={`form-input ${styles.searchInput}`}
          type="search"
          placeholder="Buscar por descrição..."
          value={filters.search ?? ''}
          onChange={(e) => onChange('search', e.target.value)}
          disabled={loading}
          aria-label="Buscar transações"
        />
      </div>

      {/* Tipo */}
      <select
        className={`form-select ${styles.select}`}
        value={filters.type ?? ''}
        onChange={(e) => onChange('type', e.target.value)}
        disabled={loading}
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
      </select>

      {/* Período inicial */}
      <input
        className={`form-input ${styles.dateInput}`}
        type="date"
        value={filters.startDate ?? ''}
        onChange={(e) => onChange('startDate', e.target.value)}
        disabled={loading}
        aria-label="Data inicial"
        title="Data inicial"
      />

      {/* Período final */}
      <input
        className={`form-input ${styles.dateInput}`}
        type="date"
        value={filters.endDate ?? ''}
        onChange={(e) => onChange('endDate', e.target.value)}
        disabled={loading}
        aria-label="Data final"
        title="Data final"
      />

      {/* Limpar filtros */}
      {hasActiveFilters && (
        <button
          className={`btn btn-ghost btn-sm ${styles.clearBtn}`}
          onClick={onClear}
          disabled={loading}
          type="button"
          title="Limpar filtros"
        >
          ✕ Limpar
        </button>
      )}
    </div>
  )
}

export default FilterBar
