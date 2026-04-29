import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Services() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-label-sm font-semibold">Privacy Centric</span>
              </div>
              <h1 className="text-h2 font-bold text-on-background md:text-h1">Why we need access</h1>
              <p className="text-body-md text-on-surface-variant max-w-md">
                To provide enterprise-grade protection, InboxGuardian needs permission to analyze specific elements of your communication flow.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: 'mail', title: 'Read email metadata', desc: 'We only scan sender info and subject lines to identify patterns.' },
                { icon: 'notification_important', title: 'Detect important messages', desc: 'Our AI separates critical business threads from automated spam.' },
                { icon: 'emergency_share', title: 'Send alerts', desc: 'Immediate notifications when high-priority risks are identified.' },
              ].map(({ icon, title, desc }) => (
                <div key={icon} className="flex gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors duration-200 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <h3 className="text-label-md font-medium text-on-surface">{title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex items-start gap-4">
              <span className="material-symbols-outlined text-tertiary">info</span>
              <p className="text-body-sm text-on-surface-variant">
                <strong className="text-on-surface block mb-1">Privacy note</strong>
                We do not store or sell your data. All processing happens through secure, encrypted tunnels with no human intervention.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/register"
                className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary rounded-xl text-body-md font-semibold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-95 transition-all active:scale-95"
              >
                Continue to Google
              </Link>
              <p className="mt-4 text-center md:text-left text-label-sm text-outline">
                Securely authenticated via Google OAuth 2.0
              </p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white p-8 rounded-3xl border border-outline-variant shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-label-sm text-outline">InboxGuardian Protection</span>
              </div>
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-16 w-full rounded-lg flex items-center px-4 gap-4 ${i === 1 ? 'bg-primary-fixed border border-primary/20' : 'bg-surface-container animate-pulse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                      {i === 1 && <span className="material-symbols-outlined text-lg">security</span>}
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className={`h-2 w-1/4 rounded ${i === 1 ? 'bg-primary/30' : 'bg-slate-200'}`}></div>
                      <div className={`h-2 w-3/4 rounded ${i === 1 ? 'bg-primary/30' : 'bg-slate-200'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant flex justify-center">
                <div className="text-center">
                  <div className="inline-block p-4 rounded-full bg-tertiary-fixed mb-4">
                    <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">shield</span>
                  </div>
                  <h4 className="text-label-md font-medium text-on-surface">End-to-End Encrypted</h4>
                  <p className="text-body-sm text-on-surface-variant">Your credentials never leave Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
