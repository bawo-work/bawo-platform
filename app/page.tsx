'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'worker' | 'company'>('worker')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://formsubmit.co/ajax/hello@bawo.work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email,
          type,
          _subject: `Bawo Waitlist: ${type} signup — ${email}`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage("You're in! We'll be in touch soon.")
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section className="final-cta bg-warm-black text-white py-16 px-6 text-center relative overflow-hidden" id="waitlist">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 relative z-10">Join the beta</h2>
      <p className="text-xl opacity-90 mb-8 max-w-[600px] mx-auto relative z-10">
        Whether you want to earn or need quality data, we&apos;re ready.
      </p>

      {status === 'success' ? (
        <div className="relative z-10 max-w-md mx-auto">
          <div className="bg-teal-700/30 border border-teal-500/40 rounded-2xl p-8">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-xl font-semibold mb-2">{message}</p>
            <p className="opacity-70 text-sm">We&apos;ll reach out when your spot is ready.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 max-w-md mx-auto">
          {/* Toggle */}
          <div className="flex gap-2 justify-center mb-6">
            <button
              type="button"
              onClick={() => setType('worker')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                type === 'worker'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              I Want to Earn
            </button>
            <button
              type="button"
              onClick={() => setType('company')}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                type === 'company'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              I Need Data
            </button>
          </div>

          {/* Email input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={type === 'worker' ? 'your@email.com' : 'work@company.com'}
              required
              className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all text-base"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-7 py-3 rounded-lg font-semibold bg-teal-700 text-white shadow-md hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0 whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>

          {status === 'error' && (
            <p className="mt-3 text-red-400 text-sm">{message}</p>
          )}

          <p className="mt-4 text-sm opacity-50">No spam. We&apos;ll only email when your access is ready.</p>
        </form>
      )}
    </section>
  )
}

export default function LandingPage() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const id = target.getAttribute('href')?.slice(1)
        if (id) {
          const element = document.getElementById(id)
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    // Navbar scroll effect
    const nav = document.getElementById('nav')
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav?.classList.add('scrolled')
      } else {
        nav?.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.fade-in-section, .section-header, .audience-card, .step, .tech-card').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Gradient Orbs */
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #2D8A83, transparent);
          top: -200px;
          right: -100px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #C45D3A, transparent);
          bottom: -150px;
          left: -100px;
        }

        /* Navigation */
        nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(254, 253, 251, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(107, 102, 92, 0.1);
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        nav.scrolled {
          background: rgba(254, 253, 251, 0.95);
          box-shadow: 0 1px 3px rgba(44, 41, 37, 0.05);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content {
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }

        .hero-visual {
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
        }

        .status-indicator::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: #2D8A3D;
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse 2s ease-in-out infinite;
        }

        .payment-demo::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%);
          animation: rotate 20s linear infinite;
        }

        .why-now::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%);
          animation: rotate 30s linear infinite;
        }

        .final-cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(26, 95, 90, 0.15), transparent);
          transform: translate(-50%, -50%);
          animation: pulse-slow 8s ease-in-out infinite;
        }

        @media (max-width: 968px) {
          .orb-1, .orb-2 {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      {/* Gradient Orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>

      {/* Navigation */}
      <nav id="nav">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <Image src="/bawo-logo.png" alt="Bawo" width={40} height={40} className="block" />
            <span className="text-2xl font-bold text-teal-700 tracking-tight">bawo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#workers" className="text-warm-gray-800 font-medium text-sm hover:text-teal-700 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all hover:after:w-full">Workers</a>
            <a href="#companies" className="text-warm-gray-800 font-medium text-sm hover:text-teal-700 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all hover:after:w-full">Companies</a>
            <a href="#how" className="text-warm-gray-800 font-medium text-sm hover:text-teal-700 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all hover:after:w-full">How It Works</a>
            <a href="#contact" className="inline-block px-7 py-3 rounded-lg font-semibold text-sm bg-teal-700 text-white shadow-md hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg transition-all">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 max-w-[1280px] mx-auto relative">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center relative z-10">
          <div className="hero-content">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-warm-black mb-6">
              <span className="bg-gradient-to-br from-teal-700 to-terracotta-500 bg-clip-text text-transparent">You get paid</span><br />
              the moment you finish
            </h1>
            <p className="text-xl text-warm-gray-600 mb-8 max-w-[560px] leading-relaxed">
              Label AI training data in your native language.
              Fair rates. Instant payment to your wallet. No delays, no minimums.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#workers" className="inline-block px-7 py-3 rounded-lg font-semibold bg-teal-700 text-white shadow-md hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg transition-all text-center">Start Earning</a>
              <a href="#companies" className="inline-block px-7 py-3 rounded-lg font-semibold bg-cream text-warm-gray-800 border border-sand hover:bg-sand transition-all text-center">I Need Data</a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-sand">
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                <span>5 second payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                <span>No minimums</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-gray-600">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                <span>Your reputation, portable</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="bg-white rounded-[20px] p-8 border border-sand shadow-xl hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
              <div className="text-sm text-warm-gray-600 mb-6 font-medium uppercase tracking-wider">Task Complete</div>
              <div className="relative bg-gradient-to-br from-teal-700 to-teal-600 rounded-2xl p-6 mb-6 overflow-hidden">
                <div className="text-6xl font-extrabold text-white mb-2 relative z-10 tabular-nums">$0.05</div>
                <div className="text-sm text-white/90 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 bg-green-500 rounded-full relative status-indicator"></span>
                  Paid to wallet • 5 seconds
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-cream hover:bg-sand hover:-translate-y-0.5 transition-all">
                  <span className="block text-3xl font-extrabold text-teal-700 tabular-nums">$4.80</span>
                  <span className="text-sm text-warm-gray-600 mt-1">Today</span>
                </div>
                <div className="text-center p-4 rounded-xl bg-cream hover:bg-sand hover:-translate-y-0.5 transition-all">
                  <span className="block text-3xl font-extrabold text-teal-700 tabular-nums">115M+</span>
                  <span className="text-sm text-warm-gray-600 mt-1">Swahili speakers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Audiences */}
      <section className="bg-gradient-to-b from-cream to-white py-16 px-6 relative">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-16 fade-in-section section-header">
            <h2 className="text-4xl md:text-5xl font-extrabold text-warm-black mb-4">Built for two sides</h2>
            <p className="text-lg text-warm-gray-600 max-w-[600px] mx-auto">Workers need fair pay. AI companies need quality data. We solve both.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Workers */}
            <div className="audience-card fade-in-section bg-white rounded-[20px] p-8 border border-sand transition-all duration-500 opacity-0 translate-y-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-0 before:bg-terracotta-500 before:transition-all hover:before:h-full hover:border-teal-700/30 hover:shadow-xl hover:-translate-y-1" id="workers">
              <h3 className="text-3xl font-extrabold text-warm-black mb-2">For Workers</h3>
              <p className="text-lg text-warm-gray-600 mb-8">Work on your phone. Get paid instantly.</p>

              <ul className="list-none mb-8">
                {[
                  '$3-6/hour median on active tasks',
                  'Payment arrives in 5 seconds',
                  'No $50 minimums to withdraw',
                  'Reputation you own—portable',
                  'Premium pay for African languages',
                  'Dollar earnings, instant to local currency'
                ].map((benefit, i) => (
                  <li key={i} className="py-4 border-b border-sand flex items-start gap-4 text-warm-gray-800 transition-all hover:pl-2 hover:text-teal-700 last:border-0">
                    <span className="text-terracotta-500 font-semibold flex-shrink-0 transition-transform hover:translate-x-1">→</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <a href="#contact" className="block w-full text-center px-7 py-3 rounded-lg font-semibold bg-teal-700 text-white shadow-md hover:bg-teal-600 hover:-translate-y-0.5 hover:shadow-lg transition-all">Join Beta</a>
            </div>

            {/* Companies */}
            <div className="audience-card fade-in-section bg-white rounded-[20px] p-8 border border-sand transition-all duration-500 opacity-0 translate-y-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-0 before:bg-teal-700 before:transition-all hover:before:h-full hover:border-teal-700/30 hover:shadow-xl hover:-translate-y-1" id="companies">
              <h3 className="text-3xl font-extrabold text-warm-black mb-2">For AI Companies</h3>
              <p className="text-lg text-warm-gray-600 mb-8">Native speakers. Quality data. No PR risk.</p>

              <ul className="list-none mb-8">
                {[
                  '150M+ speakers of underserved languages',
                  '48-hour turnaround on most tasks',
                  '90%+ accuracy backed by consensus',
                  'Independent—not conflicted',
                  'Ethical practices built in',
                  'API-first for your ML pipeline'
                ].map((benefit, i) => (
                  <li key={i} className="py-4 border-b border-sand flex items-start gap-4 text-warm-gray-800 transition-all hover:pl-2 hover:text-teal-700 last:border-0">
                    <span className="text-teal-700 font-semibold flex-shrink-0 transition-transform hover:translate-x-1">→</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <a href="#contact" className="block w-full text-center px-7 py-3 rounded-lg font-semibold bg-cream text-warm-gray-800 border border-sand hover:bg-sand transition-all">Schedule Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 relative" id="how">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 fade-in-section section-header">
            <h2 className="text-4xl md:text-5xl font-extrabold text-warm-black mb-4">Three steps to start</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { num: '1', title: 'Connect', desc: 'Link your MiniPay wallet. Verify via Self Protocol—no documents.' },
              { num: '2', title: 'Work', desc: 'Workers complete tasks on mobile. Companies submit via API.' },
              { num: '3', title: 'Get Paid', desc: 'Workers get stablecoins in 5 seconds. Companies get results in hours.' }
            ].map((step, i) => (
              <div key={i} className="step fade-in-section text-center p-6 rounded-2xl transition-all duration-500 opacity-0 translate-y-8 hover:bg-cream hover:-translate-y-2">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-600 text-white rounded-full flex items-center justify-center text-4xl font-extrabold mx-auto mb-6 shadow-lg relative transition-all hover:scale-110 hover:shadow-xl">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-warm-black mb-4">{step.title}</h3>
                <p className="text-warm-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="why-now bg-gradient-to-br from-teal-700 to-teal-600 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 relative z-10">Why this works now</h2>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {[
              { title: 'MiniPay (11M wallets)', desc: 'Distribution solved. Sub-cent fees make $0.05 payments viable.' },
              { title: 'Celo stablecoins', desc: 'One-second finality. $0.05 payment costs $0.0002 to send.' },
              { title: 'Self Protocol', desc: 'Zero-knowledge identity. Workers own reputation.' },
              { title: 'Regulatory clarity', desc: 'Kenya, Nigeria, Ghana passed VASP frameworks in 2025.' },
              { title: 'AI demand surge', desc: '$37B on GenAI training in 2025. Market growing 28% annually.' },
              { title: 'Competitor failures', desc: 'Remotasks exited Kenya. Scale AI conflicted via Meta.' }
            ].map((tech, i) => (
              <div key={i} className="tech-card fade-in-section bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-500 opacity-0 translate-y-8 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2">
                <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                <p className="opacity-90 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — Waitlist */}
      <WaitlistSection />

      {/* Footer */}
      <footer className="bg-warm-gray-800 text-white py-12 px-6" id="contact">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/bawo-logo.png" alt="Bawo" width={36} height={36} className="brightness-0 invert opacity-80" />
                <span className="text-2xl font-bold text-teal-100">bawo</span>
              </div>
              <p className="opacity-80 leading-relaxed text-sm">
                Fair pay for AI data labeling. Instant stablecoin payments to African workers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="list-none space-y-3">
                <li><a href="#workers" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">For Workers</a></li>
                <li><a href="#companies" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">For Companies</a></li>
                <li><a href="#how" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="list-none space-y-3">
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">About</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">Blog</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="list-none space-y-3">
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">Terms</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">Privacy</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 hover:pl-1 transition-all text-sm">Worker Agreement</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center opacity-60 text-sm">
            © 2026 Bawo. Built on Celo.
          </div>
        </div>
      </footer>
    </>
  )
}
