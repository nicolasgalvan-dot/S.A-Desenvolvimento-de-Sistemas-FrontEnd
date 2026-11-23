import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Navbar.module.css'

/**
 * Logo SVG inline — ícone financeiro simples.
 */
function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#fff" fillOpacity="0.15" />
      <path
        d="M9 16h14M16 9l7 7-7 7"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="16" r="2" fill="#93c5fd" />
    </svg>
  )
}

/**
 * Navbar — barra de navegação superior da aplicação.
 * Lê o usuário autenticado do AuthContext.
 */
function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Menu principal">
      <div className={styles.inner}>
        {/* Logo + Nome */}
        <div className={styles.brand}>
          <LogoIcon size={28} />
          <span className={styles.brandName}>FinTech Flow</span>
        </div>

        {/* Usuário + Ações */}
        <div className={styles.right}>
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span className={styles.userName}>
              {user?.name?.split(' ')[0] ?? user?.email ?? 'Usuário'}
            </span>
            {user?.role && (
              <span className={styles.role}>{user.role}</span>
            )}
          </div>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            type="button"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
