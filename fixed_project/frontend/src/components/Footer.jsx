import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-t border-slate-200">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <span className="font-bold text-slate-900">InboxGuardian</span>
        <span className="text-xs text-slate-500">© 2024 InboxGuardian Inc.</span>
      </div>
      <nav className="flex gap-6">
        <Link to="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-4 hover:underline">Privacy Policy</Link>
        <Link to="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-4 hover:underline">Terms of Service</Link>
        <Link to="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-4 hover:underline">Security Disclosure</Link>
        <Link to="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-4 hover:underline">Status</Link>
      </nav>
    </footer>
  )
}
