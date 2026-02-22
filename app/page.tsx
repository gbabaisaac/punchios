'use client'

import WaitlistForm from '@/components/WaitlistForm'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const phrases = [
    { text: 'Remembers', prefix: 'It' },
    { text: 'Reaches out', prefix: 'It' },
    { text: 'Cares', prefix: 'It' },
    { text: 'Texts first', prefix: 'It' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [phrases.length])

  return (
    <main className="min-h-screen bg-punch-cream relative overflow-hidden flex flex-col">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-50/20 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-punch-cream/60 backdrop-blur-md border-b border-punch-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/img/transparentpunchiocn.png" alt="Punch Logo" width={32} height={32} className="w-8 h-8" />
            <div className="text-xl font-bold tracking-tight text-punch-cocoa">Punch</div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#waitlist" className="text-sm font-medium text-gray-500 hover:text-punch-cocoa transition-colors">Waitlist</a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative pt-32 pb-20 px-6 flex-1 flex flex-col items-center justify-center z-10">
        <div className="max-w-4xl w-full text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-punch-cocoa tracking-tighter leading-[0.9] mb-8"
          >
            The AI friend that<br /><span className="text-punch-orange">texts first.</span>
          </motion.h1>

          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gray-400"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <span>{phrases[phraseIndex].prefix}</span>
                  <span className="text-punch-orange font-extrabold">
                    {phrases[phraseIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Centerpiece: Punch Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm mb-20 px-4"
        >
          <Image
            src="/img/Punchio.png"
            alt="Punch - The AI friend"
            width={320}
            height={320}
            className="mx-auto drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Waitlist Form */}
        <div id="waitlist" className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-punch-border shadow-2xl shadow-punch-orange/5"
          >
            <h2 className="text-2xl font-bold text-punch-cocoa mb-6 text-center">Join the Waitlist</h2>
            <WaitlistForm variant="hero" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-punch-border/50 z-10 bg-punch-cream/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/img/transparentpunchiocn.png" alt="Punch Logo" width={24} height={24} className="w-6 h-6 opacity-50" />
            <div className="text-lg font-bold text-punch-cocoa">Punch</div>
          </div>
          <p className="text-sm text-gray-400 font-medium text-center">
            © {new Date().getFullYear()} Punch. The AI friend that texts first.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-punch-cocoa transition-colors">Privacy</a>
            <a href="#" className="hover:text-punch-cocoa transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
