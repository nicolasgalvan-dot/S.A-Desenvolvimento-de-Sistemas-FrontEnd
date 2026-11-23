import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim())    { setError('Por favor, informe o e-mail.'); return }
    if (!password.trim()) { setError('Por favor, informe a senha.'); return }

    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.statusText ||
        'Credenciais inválidas. Verifique e tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="#1a56db"/>
              <path d="M9 16h14M16 9l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="16" r="2" fill="#93c5fd"/>
            </svg>
          </div>
          <h1 className={styles.appName}>FinTech Flow</h1>
          <p className={styles.tagline}>Gestão Financeira Inteligente</p>
        </div>

        {/* Título do formulário */}
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Entrar na conta</h2>
          <p className={styles.formSubtitle}>Bem-vindo de volta!</p>
        </div>

        {/* Erro */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading
              ? <><span className={styles.btnSpinner} />Entrando...</>
              : 'Entrar'}
          </button>
        </form>

        {/* Link para registro */}
        <p className={styles.footerLink}>
          Ainda não tem conta?{' '}
          <Link to="/register">Criar conta gratuita</Link>
        </p>
      </div>

      {/* Background decorativo */}
      <div className={styles.bgDecor} aria-hidden="true" />
    </div>
  )
}

export default Login
