import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getEmails, updatePassKeys } from '../api'
import { useAuth } from '../AuthContext'

const STEPS = [
  { label: 'Register', icon: 'person_add' },
  { label: 'Add Mail', icon: 'alternate_email' },
  { label: 'Keywords', icon: 'key' },
  { label: 'Alerts', icon: 'notifications' },
  { label: 'Passkey', icon: 'lock' },
]

export default function AddPassKey() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [emails, setEmails] = useState([])
  const [passKeys, setPassKeys] = useState({})
  const [showKeys, setShowKeys] = useState({})
  const [fetching, setFetching] = useState(!!userId)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      // Google flow — no userId yet, skip fetching, allow page to render
      setFetching(false)
      return
    }
    getEmails(userId)
      .then((data) => {
        setEmails(data)
        const init = {}
        data.forEach((e) => { init[e.email_address] = '' })
        setPassKeys(init)
      })
      .catch(() => setEmails([]))
      .finally(() => setFetching(false))
  }, [userId])

  const toggleShow = (email) => setShowKeys((prev) => ({ ...prev, [email]: !prev[email] }))

  const handleSubmit = async () => {
    if (!agreed) return setError('Please agree to the Terms and Conditions.')
    setError('')
    setLoading(true)
    try {
      if (userId) {
        const emailsPayload = Object.entries(passKeys)
          .filter(([, pk]) => pk.trim())
          .map(([email_address, pass_key]) => ({ email_address, pass_key }))
        if (emailsPayload.length > 0) {
          await updatePassKeys(userId, emailsPayload)
        }
      }
      navigate('/loading', { state: { redirectTo: '/add-keywords', message: 'Finalizing your setup...' } })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/loading', { state: { redirectTo: '/add-mail', message: 'Almost done...' } })
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FF' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading your emails...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#F8F9FF' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            InboxGuardian
          </div>
          <Link to="/alert-config" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span> Back
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-10 pb-16 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
            {STEPS.map((s, i) => {
              const num = i + 1
              const done = num < 5
              const active = num === 5
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                      done ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                    {done
                      ? <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      : <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{s.icon}</span>}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{num}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-3 sm:w-6 h-0.5 rounded-full ${done ? 'bg-green-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Step 5 of 5 · Add Passkey
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Add App Passwords</h1>
            <p className="text-slate-500 max-w-lg mx-auto">Enter an app password for each monitored email so InboxGuardian can securely access them on your behalf.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Security note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
            <span className="material-symbols-outlined text-amber-600 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Use App Passwords, not your main password</p>
              <p className="text-xs text-amber-700">For Gmail: Google Account → Security → App Passwords. For Outlook: Microsoft Account → Security → Advanced Security Options.</p>
            </div>
          </div>

          {/* Email passkey inputs */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            {emails.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-slate-300 text-5xl block mb-3">mail_off</span>
                <p className="text-slate-500 text-sm">No monitored emails found.</p>
                <Link to="/add-mail" className="text-blue-600 hover:underline text-sm font-semibold">Add emails first</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {emails.map((em) => (
                  <div key={em.email_address} className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-blue-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{em.email_address}</p>
                        <p className="text-xs text-slate-400">
                          {em.is_verified ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span> Verified
                            </span>
                          ) : 'Pending verification'}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">key</span>
                      <input
                        type={showKeys[em.email_address] ? 'text' : 'password'}
                        value={passKeys[em.email_address] || ''}
                        onChange={(e) => setPassKeys({ ...passKeys, [em.email_address]: e.target.value })}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow(em.email_address)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <span className="material-symbols-outlined text-lg">{showKeys[em.email_address] ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 mb-8 p-4 bg-white border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
              I agree to the{' '}
              <Link to="/" className="text-blue-600 font-semibold hover:underline">Terms and Conditions</Link>
              {' '}and understand that InboxGuardian will use these credentials solely to monitor my emails for security purposes.
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-6 border-t border-slate-200">
            <Link to="/alert-config" className="text-slate-500 font-semibold hover:text-slate-800 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Previous
            </Link>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleSkip}
                className="flex-1 sm:flex-none px-5 py-3 border-2 border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !agreed}
                className="flex-1 sm:flex-none px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><span className="material-symbols-outlined text-lg">lock</span> Finish Setup</>
                )}
              </button>
            </div>
          </div>

          {/* Help link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              View App Password guide
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
