import styles from './Modal.module.css'

/**
 * Modal — componente de diálogo reutilizável.
 *
 * Props:
 *  - open:      boolean
 *  - onClose:   () => void
 *  - title:     string
 *  - children:  ReactNode
 *  - size:      'sm'|'md'|'lg'  (padrão: 'md')
 */
function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`${styles.dialog} ${styles[size]}`}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title} id="modal-title">{title}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar modal"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

/**
 * ConfirmModal — modal de confirmação para ações destrutivas.
 */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className={styles.confirmMsg}>{message}</p>
      <div className={styles.confirmActions}>
        <button className="btn btn-ghost" onClick={onClose} disabled={loading} type="button">
          Cancelar
        </button>
        <button
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={loading}
          type="button"
        >
          {loading ? 'Aguarde...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default Modal
