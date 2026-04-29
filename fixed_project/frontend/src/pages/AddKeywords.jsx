import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bulkAddKeywords } from '../api'
import { useAuth } from '../AuthContext'

const STEPS = [
  { label: 'Register', icon: 'person_add' },
  { label: 'Add Mail', icon: 'alternate_email' },
  { label: 'Keywords', icon: 'key' },
  { label: 'Alerts', icon: 'notifications' },
  { label: 'Passkey', icon: 'lock' },
]

const CATEGORIES = [
  { icon: 'account_balance', label: 'Finance / Bank', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: 'work', label: 'Work', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: 'receipt_long', label: 'Bills', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: 'shopping_bag', label: 'Orders', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: 'video_call', label: 'Interviews', color: 'text-rose-600', bg: 'bg-rose-50' },
]

export default function AddKeywords() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [selected, setSelected] = useState(new Set(['Work']))
  const [aiEnabled, setAiEnabled] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [customKeywords, setCustomKeywords] = useState([])
  const [senderInput, setSenderInput] = useState('')
  const [senderKeywords, setSenderKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleCategory = (label) => {
    const next = new Set(selected)
    next.has(label) ? next.delete(label) : next.add(label)
    setSelected(next)
  }

  const addCustomKeyword = () => {
    if (keyword.trim() && !customKeywords.includes(keyword.trim())) {
      setCustomKeywords([...customKeywords, keyword.trim()])
      setKeyword('')
    }
  }

  const addSenderKeyword = () => {
    if (senderInput.trim() && !senderKeywords.includes(senderInput.trim())) {
      setSenderKeywords([...senderKeywords, senderInput.trim()])
      setSenderInput('')
    }
  }

  const handleContinue = async () => {
    // If no userId (Google flow), skip API call and just navigate forward
    if (!userId) {
      navigate('/loading', { state: { redirectTo: '/alert-config', message: 'Saving your keyword preferences...' } })
      return
    }
    setError('')
    setLoading(true)
    const subjectKws = [...Array.from(selected), ...customKeywords]
    try {
      await bulkAddKeywords(userId, [
        { type: 'subject', subject_keyword: subjectKws.length ? subjectKws : ['general'] },
        { type: 'sender', subject_keyword: senderKeywords.length ? senderKeywords : ['all'] },
      ])
      // Go through loading → alert-config
      navigate('/loading', { state: { redirectTo: '/alert-config', message: 'Saving your keyword preferences...' } })
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
          <Link to="/add-mail" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span> Back
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-10 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
            {STEPS.map((s, i) => {
              const num = i + 1
              const done = num < 3
              const active = num === 3
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                      done ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-400'}`}>
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
              Step 3 of 5 · Keywords
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">What emails matter to you?</h1>
            <p className="text-slate-500 max-w-xl mx-auto">Help InboxGuardian prioritize your inbox by identifying the types of communication that require immediate attention.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Category chips */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">label</span>
                Essential Categories
              </h2>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(({ icon, label, color, bg }) => {
                  const isActive = selected.has(label)
                  return (
                    <button
                      key={label}
                      onClick={() => toggleCategory(label)}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 text-sm font-semibold active:scale-95
                        ${isActive
                          ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : `border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:${bg}`}`}
                    >
                      <span className="material-symbols-outlined text-lg" style={isActive ? {} : {}}>{icon}</span>
                      {label}
                      {isActive && <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom keyword inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject keywords */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">subject</span>
                  Subject Keywords
                </h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
                    placeholder="e.g. Invoice, Contract"
                    className="flex-grow px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                  <button onClick={addCustomKeyword} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Add</button>
                </div>
                {customKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customKeywords.map((kw, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                        {kw}
                        <button onClick={() => setCustomKeywords(customKeywords.filter((_, j) => j !== i))} className="ml-1 text-blue-400 hover:text-blue-700">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sender filters */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-lg">person</span>
                  Sender Filters
                </h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={senderInput}
                    onChange={(e) => setSenderInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSenderKeyword()}
                    placeholder="e.g. boss@company.com"
                    className="flex-grow px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                  <button onClick={addSenderKeyword} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Add</button>
                </div>
                {senderKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {senderKeywords.map((kw, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                        {kw}
                        <button onClick={() => setSenderKeywords(senderKeywords.filter((_, j) => j !== i))} className="ml-1 text-slate-400 hover:text-slate-700">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-blue-600 text-3xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-bold text-slate-800">Enable AI smart detection (recommended)</h3>
                  <button
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${aiEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">Our LLM-powered engine automatically identifies urgent threads even without specific keywords.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
            <Link to="/add-mail" className="text-slate-500 font-semibold hover:text-slate-800 transition-colors flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Previous
            </Link>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center gap-2"
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
