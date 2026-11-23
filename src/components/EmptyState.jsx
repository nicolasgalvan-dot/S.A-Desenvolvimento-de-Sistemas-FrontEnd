import styles from './EmptyState.module.css'

/**
 * EmptyState — exibido quando não há registros para mostrar.
 *
 * Props:
 *  - icon:    string (emoji)
 *  - title:   string
 *  - message: string
 *  - action:  { label: string, onClick: fn }  (opcional)
 */
function EmptyState({ icon = '📭', title = 'Nenhum registro encontrado', message, action }) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {action && (
        <button
          className={`btn btn-primary ${styles.action}`}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
