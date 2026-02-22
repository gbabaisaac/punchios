'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SignIn() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('whats your name tho')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Generate a simple user_id from the name
      const userId = name.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString(36)

      // Register with the Link backend
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: name.trim(),
          phone: '', // No phone needed for web demo
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to register')
      }

      const data = await res.json()

      // Store user info in localStorage
      localStorage.setItem('punch_user', JSON.stringify({
        user_id: data.user_id || userId,
        name: name.trim(),
        created_at: new Date().toISOString(),
      }))

      // Go to chat
      router.push('/chat')
    } catch (err) {
      console.error('Registration error:', err)
      // Fallback — store locally and let chat work even if backend is down
      const userId = name.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString(36)
      localStorage.setItem('punch_user', JSON.stringify({
        user_id: userId,
        name: name.trim(),
        created_at: new Date().toISOString(),
      }))
      router.push('/chat')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-punch-cream relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-50/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <Image
            src="/img/Punchio.png"
            alt="Punch"
            width={120}
            height={120}
            className="drop-shadow-xl mb-4"
          />
          <h1 className="text-3xl font-black text-punch-cocoa tracking-tight">
            hey, im <span className="text-punch-orange">Punch</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">your new favorite friend</p>
        </motion.div>

        {/* Sign-in Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-punch-border shadow-2xl shadow-punch-orange/5"
        >
          <h2 className="text-xl font-bold text-punch-cocoa mb-2 text-center">
            whats your name?
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            so i know what to call you
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="type your name..."
              autoFocus
              maxLength={30}
              className="w-full px-6 py-4 rounded-2xl bg-white border border-punch-border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-punch-orange/20 focus:border-punch-orange/50 text-base transition-all"
              disabled={isLoading}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center font-medium"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 rounded-2xl font-bold text-base text-white bg-punch-orange hover:bg-punch-orangeDark transition-all disabled:opacity-50 shadow-xl shadow-punch-orange/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  connecting...
                </span>
              ) : (
                "let's talk"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <a href="/" className="text-sm text-gray-400 hover:text-punch-cocoa transition-colors font-medium">
            &larr; back to home
          </a>
        </motion.div>
      </div>
    </main>
  )
}
