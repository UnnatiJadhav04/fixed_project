import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getEmails, updatePassKeys } from '../api'
import { useAuth } from '../AuthContext'

export default function AddPassKey() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [emails, setEmails] = useState([])
  const [passKeys, setPassKeys] = useState({})
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    getEmails(userId)
      .then((data) => {
        setEmails(data)
        const initial = {}
        data.forEach((e) => { initial[e.email_address] = '' })
        setPassKeys(initial)
      })
      .catch(() => setEmails([]))
      .finally(() => setFetching(false))
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) return setError('Please agree to the Terms and Conditions.')
    setError('')
    setLoading(true)
    try {
      const emailsPayload = Object.entries(passKeys)
        .filter(([, pk]) => pk.trim())
        .map(([email_address, pass_key]) => ({ email_address, pass_key }))

      if (emailsPayload.length > 0) {
        await updatePassKeys(userId, emailsPayload)
      }
      setSaved(true)
      navigate('/loading')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="font-sans text-on-surface antialiased min-h-screen" style={{ backgroundColor: '#faf8ff' }}>
      <div className="flex min-h-screen items-center justify-center p-md md:p-2xl">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="hidden lg:flex lg:col-span-4 flex-col space-y-xl sticky top-xl">
            <div className="flex items-center space-x-sm">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
              </div>
              <span className="text-h3 font-semibold text-primary tracking-tight">InboxGuardian</span>
            </div>
            <div className="space-y-lg">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg border border-outline-variant bg-gradient-to-br from-primary-fixed to-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
              <div className="space-y-md">
                <h3 className="text-h3 font-semibold text-on-surface">Step 4 of 4</h3>
                <p className="text-body-sm text-on-surface-variant">Add app passwords (passkeys) so InboxGuardian can monitor your email accounts securely.</p>
                <div className="flex gap-xs">
                  {[1,1,1,1].map((_, i) => (
                    <div key={i} className="h-1.5 w-8 rounded-full bg-primary"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-lg md:p-xl space-y-xl">
              <header className="space-y-xs">
                <h1 className="text-h2 font-semibold text-on-surface">Add App Passwords</h1>
                <p className="text-body-md text-on-surface-variant">Enter an app password (passkey) for each monitored email so InboxGuardian can securely access them.</p>
              </header>

              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-lg">
                {emails.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2">mail_off</span>
                    No monitored emails found. <Link to="/add-mail" className="text-primary hover:underline">Add emails first.</Link>
                  </div>
                ) : (
                  emails.map((em) => (
                    <div key={em.email_address} className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                      <div className="space-y-xs">
                        <label className="text-label-sm text-on-surface-variant font-semibold">Email</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
                          <input
                            type="text"
                            value={em.email_address}
                            readOnly
                            className="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant bg-surface-container text-body-md text-on-surface-variant cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="space-y-xs">
                        <label className="text-label-sm text-on-surface-variant font-semibold">App Password</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">key</span>
                          <input
                            type="password"
                            value={passKeys[em.email_address] || ''}
                            onChange={(e) => setPassKeys({ ...passKeys, [em.email_address]: e.target.value })}
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="w-full pl-10 pr-md py-sm rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-lg flex gap-md">
                  <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  <div className="space-y-xs">
                    <h4 className="text-label-md font-medium text-on-surface">Security Note</h4>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      For Gmail or Outlook, use a dedicated <strong>App Password</strong> — not your primary account password. Generate one from your Google/Microsoft account security settings.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-md pt-md">
                  <div className="flex items-center space-x-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
                    />
                    <label htmlFor="terms" className="text-label-md text-on-surface-variant">
                      I agree to the <Link to="/" className="text-primary hover:underline">Terms and Conditions</Link>
                    </label>
                  </div>
                  <div className="flex gap-sm">
                    <Link to="/alert-config" className="px-lg py-sm rounded-lg text-secondary text-label-md font-medium hover:bg-surface-container-high transition-all">
                      Back
                    </Link>
                    <button
                      onClick={() => navigate('/loading')}
                      type="button"
                      className="px-lg py-sm rounded-lg border border-outline text-secondary text-label-md font-medium hover:bg-surface-container-high transition-all"
                    >
                      Skip for now
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-xl py-sm rounded-lg bg-primary text-white text-label-md font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {loading ? 'Saving...' : 'Finish Setup'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-surface-container border-t border-outline-variant px-lg py-sm flex justify-center items-center gap-xs">
              <span className="text-label-sm text-on-surface-variant">Having trouble?</span>
              <a href="#" className="text-label-sm text-primary hover:underline flex items-center">
                View App Password Guide
                <span className="material-symbols-outlined text-base ml-xs">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
