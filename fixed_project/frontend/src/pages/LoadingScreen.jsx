import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ALL_STEPS = [
  'Establishing secure connection',
  'Verifying credentials',
  'Setting up your profile',
  'Finalizing security layer',
]

export default function LoadingScreen() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // Where to go after loading; default to /setup-complete
  const redirectTo = state?.redirectTo || '/setup-complete'
  const customMessage = state?.message || 'Connecting your inbox...'

  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 3
        if (next >= 100) {
          clearInterval(interval)
          setDone(true)
          return 100
        }
        // Update step based on progress
        setStepIndex(Math.min(Math.floor((next / 100) * ALL_STEPS.length), ALL_STEPS.length - 1))
        return next
      })
    }, 60)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate(redirectTo), 600)
      return () => clearTimeout(t)
    }
  }, [done, navigate, redirectTo])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans" style={{ backgroundColor: '#F0F4FF' }}>
      <main className="w-full max-w-md px-6 flex flex-col items-center text-center">

        {/* Brand */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">InboxGuardian</span>
        </div>

        {/* Animated shield illustration */}
        <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
          {/* Outer pulse rings */}
          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-30 scale-75" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-4 rounded-full bg-blue-100 animate-ping opacity-20" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>

          {/* Main icon card */}
          <div className="relative z-10 w-32 h-32 bg-white rounded-3xl shadow-xl border border-blue-100 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: '52px', fontVariationSettings: "'FILL' 1" }}>
              {done ? 'check_circle' : 'inbox'}
            </span>
            {!done && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            )}
          </div>

          {/* Floating badge */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-white border border-blue-100 rounded-xl shadow-md flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">shield</span>
          </div>
          {!done && (
            <div className="absolute -bottom-2 -left-4 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-md flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-xs text-slate-600 font-medium">Scanning</span>
            </div>
          )}
          {done && (
            <div className="absolute -bottom-2 -left-4 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full shadow-md flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-green-700 font-medium">Ready</span>
            </div>
          )}
        </div>

        {/* Text + progress */}
        <div className="w-full space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">{customMessage}</h1>
            <p className="text-sm text-slate-500">Analyzing recent emails for potential threats.</p>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-slate-400 font-medium -mt-2">{Math.round(progress)}%</div>

          {/* Steps checklist */}
          <div className="flex flex-col gap-2 text-left">
            {ALL_STEPS.map((step, i) => {
              const isDone = i < stepIndex || (done && i <= stepIndex)
              const isActive = i === stepIndex && !done
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500
                  ${isDone ? 'bg-green-50 border-green-100' :
                    isActive ? 'bg-blue-50 border-blue-200' :
                    'border-transparent opacity-30'}`}>
                  {isDone ? (
                    <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  ) : isActive ? (
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-lg">radio_button_unchecked</span>
                  )}
                  <span className={`text-sm font-medium ${isDone ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-xs text-slate-400">
        Setting up your encrypted sandbox · Usually under 5 seconds
      </footer>
    </div>
  )
}
