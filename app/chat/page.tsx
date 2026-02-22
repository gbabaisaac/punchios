'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface PunchUser {
  user_id: string
  name: string
  created_at: string
}

export default function Chat() {
  const router = useRouter()
  const [user, setUser] = useState<PunchUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('punch_user')
    if (!stored) {
      router.push('/signin')
      return
    }
    const parsed = JSON.parse(stored) as PunchUser
    setUser(parsed)

    // Load chat history from localStorage
    const history = localStorage.getItem(`punch_chat_${parsed.user_id}`)
    if (history) {
      setMessages(JSON.parse(history))
    }
  }, [router])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Save messages to localStorage
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`punch_chat_${user.user_id}`, JSON.stringify(messages))
    }
  }, [messages, user])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          message: userMsg.content,
        }),
      })

      if (!res.ok) throw new Error('Chat failed')

      const data = await res.json()

      // Small delay to feel natural
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 700))

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "yo my bad, im having connection issues rn. try again in a sec?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    if (user) {
      localStorage.removeItem(`punch_chat_${user.user_id}`)
      setMessages([])
    }
  }

  const signOut = () => {
    localStorage.removeItem('punch_user')
    router.push('/signin')
  }

  if (!user) return null

  return (
    <div className="h-dvh flex flex-col bg-punch-cream">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/60 backdrop-blur-md border-b border-punch-border/50 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/img/transparentpunchiocn.png"
              alt="Punch"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <div>
              <h1 className="text-lg font-bold text-punch-cocoa leading-tight">Punch</h1>
              <p className="text-[11px] text-green-500 font-semibold">online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium px-2 py-1"
            >
              clear
            </button>
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium px-2 py-1"
            >
              sign out
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Welcome message if no messages */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Image
                src="/img/Punchio.png"
                alt="Punch"
                width={100}
                height={100}
                className="drop-shadow-lg mb-6 opacity-80"
              />
              <h2 className="text-xl font-bold text-punch-cocoa mb-2">
                hey {user.name}!
              </h2>
              <p className="text-gray-400 text-sm max-w-xs">
                im punch, your ai friend. just text me like you would a friend — i dont bite
              </p>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col gap-1 max-w-[80%] sm:max-w-[70%]">
                  <div
                    className={`px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-punch-orange text-white rounded-2xl rounded-br-md shadow-md shadow-punch-orange/10'
                        : 'bg-white text-gray-800 border border-punch-border rounded-2xl rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span
                    className={`text-[10px] text-gray-400 px-1 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-punch-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-md border-t border-punch-border/50 px-4 py-3">
        <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="text punch..."
            autoFocus
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-full bg-white border border-punch-border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-punch-orange/20 focus:border-punch-orange/50 text-[15px] transition-all disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-punch-orange text-white shadow-lg shadow-punch-orange/20 disabled:opacity-30 transition-all flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  )
}
