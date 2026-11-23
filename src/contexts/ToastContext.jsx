import { createContext, useContext, useState, useCallback, useRef } from 'react'

/**
 * ToastContext — sistema de notificações global (sem dependência externa).
 *
 * Uso:
 *   const toast = useToast()
 *   toast.success('Transação salva!')
 *   toast.error('Falha ao salvar.')
 *   toast.warning('Atenção: dado inválido.')
 *   toast.info('Carregando...')
 */

const ToastContext = createContext(null)

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const add = useCallback((type, message, duration = 4000) => {
    const id = nextId++
    setToasts((prev) => [...prev.slice(-4), { id, type, message }])
    timers.current[id] = setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  const toast = {
    success: (msg, dur) => add('success', msg, dur),
    error:   (msg, dur) => add('error',   msg, dur ?? 6000),
    warning: (msg, dur) => add('warning', msg, dur),
    info:    (msg, dur) => add('info',    msg, dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

/* ── Hook ──────────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}

/* ── Container de Toasts ───────────────────────────────── */
function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div style={styles.container} role="region" aria-label="Notificações" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

/* ── Item de Toast ──────────────────────────────────────── */
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

const COLORS = {
  success: { bg: '#ecfdf5', border: '#6ee7b7', icon: '#059669', text: '#065f46' },
  error:   { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626', text: '#7f1d1d' },
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706', text: '#78350f' },
  info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#1d4ed8', text: '#1e3a8a' },
}

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info
  return (
    <div
      role="alert"
      style={{
        ...styles.toast,
        background: c.bg,
        borderColor: c.border,
        color: c.text,
      }}
    >
      <span style={{ ...styles.icon, color: c.icon }}>{ICONS[toast.type]}</span>
      <span style={styles.message}>{toast.message}</span>
      <button
        style={styles.close}
        onClick={() => onRemove(toast.id)}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  )
}

/* ── Estilos inline (sem dependência de CSS externo) ─── */
const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '380px',
    width: 'calc(100vw - 48px)',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    animation: 'none',
    pointerEvents: 'auto',
  },
  icon: {
    fontWeight: 700,
    fontSize: '15px',
    flexShrink: 0,
    lineHeight: 1.4,
  },
  message: {
    flex: 1,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  close: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: 1,
    padding: '0 2px',
    opacity: 0.6,
    color: 'inherit',
    flexShrink: 0,
  },
}

export default ToastContext
