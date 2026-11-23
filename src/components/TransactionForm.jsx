import { useState, useEffect } from 'react'
import { getCategoriesByType } from '../services/transactionService'
import styles from './TransactionForm.module.css'

/**
 * TransactionForm — formulário para criação e edição de transações.
 *
 * Props:
 *  - initialData:  object  — dados para edição (null = nova transação)
 *  - onSubmit:     async (data) => void
 *  - onCancel:     () => void
 *  - loading:      boolean
 */
function TransactionForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const isEditing = !!initialData

  const [form, setForm] = useState({
    description: '',
    amount:      '',
    type:        'expense',
    category:    '',
    date:        new Date().toISOString().slice(0, 10),
    ...initialData,
    amount: initialData?.amount ? String(initialData.amount) : '',
  })

  const [errors, setErrors] = useState({})

  // Reseta categoria quando tipo muda
  useEffect(() => {
    if (!isEditing) {
      setForm((f) => ({ ...f, category: '' }))
    }
  }, [form.type, isEditing])

  const categories = getCategoriesByType(form.type)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.description.trim())       e.description = 'Informe a descrição.'
    if (!form.amount || isNaN(Number(form.amount.replace(',', '.')))) {
      e.amount = 'Informe um valor numérico válido.'
    } else if (Number(form.amount.replace(',', '.')) <= 0) {
      e.amount = 'O valor deve ser maior que zero.'
    }
    if (!form.type)                     e.type = 'Selecione o tipo.'
    if (!form.category)                 e.category = 'Selecione a categoria.'
    if (!form.date)                     e.date = 'Informe a data.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    const data = {
      ...form,
      amount: Number(form.amount.replace(',', '.')),
    }
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {/* Tipo */}
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={`${styles.typeBtn} ${form.type === 'expense' ? styles.expense : ''}`}
          onClick={() => set('type', 'expense')}
        >
          ↓ Despesa
        </button>
        <button
          type="button"
          className={`${styles.typeBtn} ${form.type === 'income' ? styles.income : ''}`}
          onClick={() => set('type', 'income')}
        >
          ↑ Receita
        </button>
      </div>

      {/* Descrição */}
      <div className="form-group">
        <label className="form-label required" htmlFor="tx-desc">Descrição</label>
        <input
          id="tx-desc"
          className={`form-input${errors.description ? ' error' : ''}`}
          type="text"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Ex: Aluguel, Salário, Supermercado..."
          disabled={loading}
          autoFocus
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Valor */}
      <div className="form-group">
        <label className="form-label required" htmlFor="tx-amount">Valor (R$)</label>
        <input
          id="tx-amount"
          className={`form-input${errors.amount ? ' error' : ''}`}
          type="text"
          inputMode="decimal"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          placeholder="0,00"
          disabled={loading}
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* Categoria */}
      <div className="form-group">
        <label className="form-label required" htmlFor="tx-cat">Categoria</label>
        <select
          id="tx-cat"
          className={`form-select${errors.category ? ' error' : ''}`}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          disabled={loading}
        >
          <option value="">Selecione...</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      {/* Data */}
      <div className="form-group">
        <label className="form-label required" htmlFor="tx-date">Data</label>
        <input
          id="tx-date"
          className={`form-input${errors.date ? ' error' : ''}`}
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          disabled={loading}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`btn ${form.type === 'income' ? 'btn-success' : 'btn-primary'}`}
          disabled={loading}
        >
          {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar transação'}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
