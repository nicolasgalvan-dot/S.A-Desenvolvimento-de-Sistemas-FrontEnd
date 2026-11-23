import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import PrivateRoute from './routes/PrivateRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './contexts/AuthContext'

/**
 * AppShell — envolve rotas privadas com a Navbar.
 * Rotas públicas (login/register) NÃO exibem a Navbar.
 */
function AppShell({ children }) {
  const { isAuthenticated } = useAuth()
  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
    </>
  )
}

/**
 * App — componente raiz.
 *
 * Hierarquia de providers:
 *   AuthProvider (autenticação global)
 *     ToastProvider (notificações globais)
 *       BrowserRouter (roteamento)
 *
 * Rotas:
 *   /login      → público  → Login.jsx
 *   /register   → público  → Register.jsx
 *   /dashboard  → privado  → Dashboard.jsx (via PrivateRoute + Navbar)
 *   /           → redireciona para /login
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rota privada */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
