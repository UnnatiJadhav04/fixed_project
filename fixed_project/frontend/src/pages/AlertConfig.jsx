import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveAlertConfig } from '../api'
import { useAuth } from '../AuthContext'

const STEPS = [
  { label: 'Register', icon: 'person_add' },
  { label: 'Add Mail', icon: 'alternate_email' },
  { label: 'Keywords', icon: 'key' },
  { label: 'Alerts', icon: 'notifications' },
  { label: 'Passkey', icon: 'lock' },
]

const URGENCY_LEVELS = ['low', 'medium', 'high']

function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
      title={label}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function AlertConfig() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [push, setPush] = useState(true)
  const [emailAlert, setEmailAlert] = useState(false)
  const [whatsapp, setWhatsapp] = useState(false)
  const [sms, setSms] = useState(false)
  const [urgency, setUrgency] = useState(1)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFinish = async () => {
    if (!userId) {
      navigate('/loading', { state: { redirectTo: '/add-passkey', message: 'Saving your alert preferences...' } })
      return
    }
    setError('')
    setLoading(true)
    try {
      await saveAlertConfig(userId, [{
        email_alert: emailAlert,
        push_notification: push,
        whatsapp_alert: whatsapp,
        sms_alert: sms,
        urgency_level: URGENCY_LEVELS[urgency],
      }])
      // Through loading → add-passkey
      navigate('/loading', { state: { redirectTo: '/add-passkey', message: 'Saving your alert preferences...' } })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#F8F9FF' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            InboxGuardian
          </div>
          <Link to="/add-keywords" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
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
              const done = num < 4
              const active = num === 4
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
              Step 4 of 5 · Alert Config
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">How should we alert you?</h1>
            <p className="text-slate-500">Select your preferred channels and alert urgency level.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Push + Email side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Push */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">notifications</span>
                  </div>
                  <Toggle checked={push} onChange={() => setPush(!push)} label="Push notifications" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Push Notifications</h3>
                <p className="text-xs text-slate-500">Real-time alerts on your device.</p>
              </div>

              {/* Email */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600">mail</span>
                  </div>
                  <Toggle checked={emailAlert} onChange={() => setEmailAlert(!emailAlert)} label="Email alerts" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Email Alerts</h3>
                <p className="text-xs text-slate-500">Reports sent to your inbox.</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-green-600">chat</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">WhatsApp Alerts</h3>
                    <p className="text-xs text-slate-500">Receive urgent alerts via WhatsApp.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                  <Toggle checked={whatsapp} onChange={() => setWhatsapp(!whatsapp)} label="WhatsApp alerts" />
                </div>
              </div>
            </div>

            {/* SMS */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600">sms</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">SMS Alerts</h3>
                    <p className="text-xs text-slate-500">Direct text messages for critical changes.</p>
                  </div>
                </div>
                <Toggle checked={sms} onChange={() => setSms(!sms)} label="SMS alerts" />
              </div>
            </div>

            {/* Urgency slider */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <h3 className="text-sm font-bold mb-1">Urgency Level</h3>
              <p className="text-xs text-blue-200 mb-5">How often should we interrupt you?</p>
              <input
                type="range"
                min="0" max="2" step="1"
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between mt-3 text-xs font-bold uppercase tracking-wider text-blue-100">
                <span className={urgency === 0 ? 'text-white' : ''}>Low</span>
                <span className={urgency === 1 ? 'text-white' : ''}>Medium</span>
                <span className={urgency === 2 ? 'text-white' : ''}>High</span>
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full">
                  {['Low — Minimal interruptions', 'Medium — Balanced alerts', 'High — All urgent emails'][urgency]}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <Link to="/add-keywords" className="text-slate-500 font-semibold hover:text-slate-800 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Previous
            </Link>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <>Continue <span className="material-symbols-outlined text-lg">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
