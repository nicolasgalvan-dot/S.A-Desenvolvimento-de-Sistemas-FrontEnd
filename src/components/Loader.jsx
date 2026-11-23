import styles from './Loader.module.css'

/**
 * Loader — indicador de carregamento.
 *
 * Props:
 *  - size:    'sm'|'md'|'lg'  (padrão: 'md')
 *  - label:   string          (padrão: 'Carregando...')
 *  - fullPage: boolean        — ocupa a tela toda
 */
function Loader({ size = 'md', label = 'Carregando...', fullPage = false }) {
  const spinner = (
    <div className={styles.wrap} role="status" aria-label={label}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )

  if (fullPage) {
    return <div className={styles.fullPage}>{spinner}</div>
  }

  return spinner
}

export default Loader
