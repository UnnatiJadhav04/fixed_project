import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function SetupComplete() {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans px-6" style={{ backgroundColor: '#F0F7FF' }}>
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-200 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Confetti-style header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl border border-blue-100 mb-6 relative">
            <span className="material-symbols-outlined text-blue-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-amber-500 text-lg">celebration</span>
            </div>
            <div className="absolute -bottom-2 -left-3 w-10 h-10 bg-green-50 border border-green-200 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">You're all set!</h1>
          <p className="text-slate-500 text-base max-w-xs mx-auto">InboxGuardian is now actively monitoring your emails. We'll notify you when something important arrives.</p>
        </div>

        {/* Status badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold">Inbox Shield Active</span>
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
        </div>

        {/* Step completion summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Setup Complete</h3>
          <div className="space-y-3">
            {[
              { icon: 'person_add', label: 'Account registered', done: true },
              { icon: 'alternate_email', label: 'Email accounts added', done: true },
              { icon: 'key', label: 'Keywords configured', done: true },
              { icon: 'notifications', label: 'Alert preferences saved', done: true },
              { icon: 'lock', label: 'App passwords configured', done: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-green-600 text-base">{item.icon}</span>
                </div>
                <span className="text-sm font-medium text-slate-700 flex-grow">{item.label}</span>
                <span className="material-symbols-outlined text-green-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: 'mail', title: 'Auto-filtering', value: 'Enabled', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: 'notifications_active', title: 'Smart Alerts', value: 'Immediate', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(({ icon, title, value, color, bg }) => (
            <div key={icon} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <div className={`${bg} p-2.5 rounded-lg`}>
                <span className={`material-symbols-outlined ${color} text-xl`}>{icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">{title}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-4 px-6 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 text-center flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Go to Dashboard
          </Link>
          <Link
            to="/alert-config"
            className="w-full py-3.5 px-6 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-center"
          >
            View Security Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
