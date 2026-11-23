import styles from './StatCard.module.css'

/**
 * StatCard — cartão de indicador financeiro para o dashboard.
 *
 * Props:
 *  - title:   string  — rótulo do indicador
 *  - value:   string  — valor formatado (ex: "R$ 10.000,00")
 *  - icon:    string  — emoji ou símbolo (ex: "💰")
 *  - variant: 'default'|'income'|'expense'|'neutral'
 *  - loading: boolean
 *  - trend:   number  — percentual de variação (opcional)
 */
function StatCard({ title, value, icon, variant = 'default', loading = false, trend }) {
  const trendPositive = trend > 0
  const trendZero     = trend === 0 || trend === undefined || trend === null

  return (
    <div className={`${styles.card} ${styles[variant] ?? ''}`}>
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      </div>

      {loading ? (
        <div className={styles.skeleton} aria-label="Carregando..." />
      ) : (
        <>
          <p className={styles.value}>{value}</p>
          {!trendZero && (
            <p className={`${styles.trend} ${trendPositive ? styles.trendUp : styles.trendDown}`}>
              {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% em relação ao mês anterior
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default StatCard
