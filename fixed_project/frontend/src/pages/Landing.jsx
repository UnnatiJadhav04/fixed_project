import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import googleImg from "../assets/google.png"
import instantAlerts from "../assets/instant alerts.png";
import multiAccount from "../assets/multiaccountsupport.png";
import secureLogin from "../assets/securelogin.png";
import smartFiltering from "../assets/smartfiltering.png";

export default function Landing() {
  return (
    <div className="bg-background text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-semibold">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              SECURE EMAIL MONITORING
            </div>
            <h1 className="text-h1 font-bold text-on-surface">Never miss important emails again</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              InboxGuardian uses AI to detect and alert you about critical emails across all your inboxes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="flex items-center justify-center gap-3 bg-white border border-outline-variant px-8 py-4 rounded-xl shadow-sm hover:bg-surface-container transition-colors active:scale-95"
              >
                <span className="text-label-md font-medium text-on-surface">Get Started with Google</span>
              </Link>
              <Link
                to="/services"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-label-md font-medium text-primary hover:bg-primary-fixed transition-colors active:scale-95"
              >
                See how it works
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-body-sm">We never store your emails</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-body-sm">Secure login with Google</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
             <div className="w-full h-64 bg-gradient-to-br from-primary-fixed to-secondary-container flex items-center justify-center">
 <img 
  src={googleImg} 
  alt="Google" 
  className="w-full h-full object-cover"
/>
</div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed-dim rounded-full blur-3xl opacity-20 -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-tertiary-fixed rounded-full blur-3xl opacity-10 -z-10"></div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="md:col-span-2 bg-surface-container-low p-10 rounded-3xl border border-outline-variant flex flex-col justify-between group overflow-hidden relative" style={{
  backgroundImage: `url(${smartFiltering})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h3 className="text-h3 font-semibold text-white mb-4">
  Smart filtering
</h3>

<p className="text-body-md text-white/80 max-w-md">
  Our advanced AI models analyze intent and priority, ensuring high-value communications never get lost in the noise.
</p>
              </div>
              <div className="mt-8 flex justify-end transform group-hover:translate-x-2 transition-transform">
                <div className="rounded-xl border border-outline-variant shadow-md w-2/3 h-24 bg-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">filter_list</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-outline-variant flex flex-col justify-between shadow-sm" style={{
  backgroundImage: `url(${multiAccount})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}>
              <div>
                <div className="w-12 h-12 bg-secondary text-on-secondary rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <h3 className="text-h3 font-semibold text-on-surface mb-4">Multi-account support</h3>
                <p className="text-body-sm text-on-surface-variant">Connect Gmail, Outlook, and custom IMAP accounts in one secure dashboard.</p>
              </div>
            </div>

            <div className="bg-primary-container p-10 rounded-3xl border border-primary text-on-primary-container flex flex-col justify-between md:col-span-1 min-h-[320px]" style={{
  backgroundImage: `url(${instantAlerts})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}>
              <div  >
                <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <h3 className="text-h3 font-semibold mb-4">Instant alerts</h3>
                <p className="text-body-sm opacity-90">Get notified via SMS, Slack, or Push only when an email actually requires your immediate attention.</p>
              </div>
              <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></div>
                  <span className="text-label-sm">High priority detected: "Contract Proposal"</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-tertiary-container text-on-tertiary-container p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8"
            style={{
  backgroundImage: `url(${secureLogin})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}
            >
              <div className="flex-1">
               <h3 className="text-h3 font-bold mb-4 text-black">
  Your privacy is our priority
</h3>

<p className="text-body-md font-bold text-black">
  We use zero-storage processing. Your emails are analyzed in-memory and discarded immediately. We never sell your data.
</p>
              </div>
              <div className="flex-shrink-0 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-h2 font-semibold text-on-surface mb-12">Trusted by secure-conscious teams</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
            <span className="text-h3 font-semibold tracking-tighter">TECHCORP</span>
            <span className="text-h3 font-semibold tracking-tighter">FINFLOW</span>
            <span className="text-h3 font-semibold tracking-tighter">SECURE.IO</span>
            <span className="text-h3 font-semibold tracking-tighter">NODESTACK</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
