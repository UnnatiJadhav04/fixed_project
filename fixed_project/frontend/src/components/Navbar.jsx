import { Link } from 'react-router-dom'

export default function Navbar({ minimal = false }) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-slate-900 tracking-tighter">
          InboxGuardian
        </Link>
        {!minimal && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200">Features</Link>
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200">Security</Link>
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200">Pricing</Link>
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200">Support</Link>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        {minimal ? (
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200">Support</Link>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 active:scale-95 transition-transform">Login</Link>
            <Link to="/register" className="text-sm font-medium bg-primary text-on-primary px-4 py-2 rounded-lg active:scale-95 transition-transform">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
