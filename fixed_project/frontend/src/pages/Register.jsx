import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { sendOtp, verifyOtp, register } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email.')
    setError('')
    setLoading(true)
    try {
      await sendOtp(email)
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return setError('Please enter the OTP.')
    setError('')
    setLoading(true)
    try {
      await verifyOtp(email, otp)
      setStep(3)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!fullName || !mobile || !password) return setError('Please fill all fields.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    setError('')
    setLoading(true)
    try {
      await register(fullName, email, password, mobile)
      // Go through loading screen → then redirect to add-mail
      navigate('/loading', { state: { redirectTo: '/add-mail', message: 'Creating your account...' } })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Google button: go through loading screen → add-mail
  const handleGoogleContinue = () => {
    navigate('/loading', { state: { redirectTo: '/add-mail', message: 'Authenticating with Google...' } })
  }

  const STEPS_META = [
    { label: 'Register', icon: 'person_add' },
    { label: 'Add Mail', icon: 'alternate_email' },
    { label: 'Keywords', icon: 'key' },
    { label: 'Alerts', icon: 'notifications' },
    { label: 'Passkey', icon: 'lock' },
  ]

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#F8F9FF' }}>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
<div className="flex items-center text-lg font-bold text-black">
  <Link to="/" className="hover:opacity-80">
    InboxGuardian
  </Link>
</div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Support</a>
            <Link to="/login" className="text-sm font-semibold text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
            {STEPS_META.map((s, i) => {
              const num = i + 1
              const done = num < 1 // registration is always step 1, none done yet
              const active = num === 1
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                      'bg-slate-100 text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{s.icon}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{num}</span>
                  </div>
                  {i < STEPS_META.length - 1 && (
                    <div className="w-3 sm:w-6 h-0.5 rounded-full bg-slate-200" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Step 1 of 5 · Register
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">Start your 14-day free trial. No credit card required.</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleContinue}
            className="w-full mb-6 py-3 px-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-[#F8F9FF] px-4 text-xs text-slate-400 font-medium uppercase tracking-wider">or register with email</span></div>
          </div>

          {/* Form card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Step 1: Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  Email Address
                  {step > 1 && <span className="ml-2 text-green-600 text-xs font-medium">✓ Sent</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && step === 1 && handleSendOtp()}
                    disabled={step > 1}
                    placeholder="name@company.com"
                    className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || step > 1}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap
                      ${step > 1 ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50'}`}
                  >
                    {loading && step === 1 ? '...' : step > 1 ? '✓ Sent' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* Step 2: OTP */}
              <div className={`space-y-2 transition-all duration-300 ${step < 2 ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="text-sm font-semibold text-slate-700 block">
                  Verification Code
                  {step > 2 && <span className="ml-2 text-green-600 text-xs font-medium">✓ Verified</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && step === 2 && handleVerifyOtp()}
                    disabled={step !== 2}
                    placeholder="Enter 6-digit code"
                    className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed tracking-widest"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={step !== 2 || loading}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap
                      ${step > 2 ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50'}`}
                  >
                    {loading && step === 2 ? '...' : step > 2 ? '✓ Verified' : 'Verify'}
                  </button>
                </div>
                {step === 2 && (
                  <p className="text-xs text-slate-400">Check your inbox at <strong className="text-slate-600">{email}</strong></p>
                )}
              </div>

              {/* Step 3: User details */}
              <div className={`space-y-4 transition-all duration-300 ${step < 3 ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="h-px bg-slate-100 my-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={step < 3} placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">Mobile Number</label>
                    <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={step < 3} placeholder="9999999999"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={step < 3} placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={step < 3} placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60" />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={step < 3 || loading}
                className="w-full py-3.5 px-4 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading && step === 3 ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <><span className="material-symbols-outlined text-lg">person_add</span> Create Account</>
                )}
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
