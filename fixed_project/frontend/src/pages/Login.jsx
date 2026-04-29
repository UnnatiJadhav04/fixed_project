import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { login } from '../api'
import { useAuth } from '../AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { saveUserId } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const registered = location.state?.registered

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Please enter both email and password.')
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      saveUserId(data.user_id)
      navigate('/add-mail')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar minimal />
      <main className="flex-grow flex items-center justify-center px-6 py-24 relative overflow-hidden" style={{ background: 'radial-gradient(circle at top left, #ffffff 0%, #f3f2fe 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0037b0 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-full max-w-md z-10">
          {registered && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Account created! Please sign in.
            </div>
          )}

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-xl flex flex-col items-center text-center">
            <div className="mb-lg">
              <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center mb-md mx-auto">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
              </div>
              <h1 className="text-h2 font-semibold text-on-surface mb-xs">Welcome back</h1>
              <p className="text-body-md text-on-surface-variant">Secure your communications with InboxGuardian.</p>
            </div>

            {error && (
              <div className="w-full mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <div className="w-full space-y-md">
              <form onSubmit={handleSubmit} className="text-left space-y-sm">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1 ml-1">Email address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-md py-3 text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1 ml-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-md py-3 text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary text-label-md font-medium py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>

            <div className="mt-lg pt-lg border-t border-outline-variant w-full">
              <div className="flex items-center justify-center gap-2 text-on-surface-variant mb-md">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <p className="text-body-sm">Your credentials are encrypted in transit.</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                New to InboxGuardian?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
              </p>
            </div>
          </div>

          <div className="mt-xl grid grid-cols-3 gap-lg opacity-40">
            {[{ icon: 'encrypted', label: 'AES-256' }, { icon: 'gpp_good', label: 'SOC2 Type II' }, { icon: 'policy', label: 'GDPR Ready' }].map(({ icon, label }) => (
              <div key={icon} className="flex flex-col items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">{icon}</span>
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-tighter">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
