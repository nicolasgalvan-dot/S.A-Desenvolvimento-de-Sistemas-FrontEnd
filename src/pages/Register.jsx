import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import styles from './Login.module.css'   // Reutiliza os mesmos estilos do Login

function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim())    { setError('Por favor, informe o seu nome.'); return }
    if (!email.trim())   { setError('Por favor, informe o e-mail.'); return }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('Informe um e-mail válido.'); return }

    if (!password.trim())       { setError('Por favor, informe a senha.'); return }
    if (password.length < 6)   { setError('A senha deve ter pelo menos 6 caracteres.'); return }

    setIsLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...')
      setTimeout(() => navigate('/login', { replace: true }), 1500)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.statusText ||
        'Erro ao realizar o cadastro. Tente novamente.'
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

        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Criar conta</h2>
          <p className={styles.formSubtitle}>Comece a controlar suas finanças</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="status">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome completo</label>
            <input
              id="name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              disabled={isLoading}
              autoComplete="name"
              autoFocus
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <span className="form-hint">Use pelo menos 6 caracteres.</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading
              ? <><span className={styles.btnSpinner} />Cadastrando...</>
              : 'Criar conta'}
          </button>
        </form>

        <p className={styles.footerLink}>
          Já tem uma conta?{' '}
          <Link to="/login">Fazer login</Link>
        </p>
      </div>
      <div className={styles.bgDecor} aria-hidden="true" />
    </div>
  )
}

export default Register
