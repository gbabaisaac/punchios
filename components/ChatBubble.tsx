'use client'

import { motion } from 'framer-motion'

interface ChatBubbleProps {
  message: string
  isUser?: boolean
  delay?: number
  showTimestamp?: boolean
  timestamp?: string
}

export default function ChatBubble({
  message,
  isUser = false,
  delay = 0,
  showTimestamp = false,
  timestamp
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex flex-col gap-1">
        {showTimestamp && timestamp && (
          <span className={`text-[10px] text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </span>
        )}
        <div
          className={`px-4 py-3 max-w-[260px] ${
            isUser
              ? 'bg-punch-orange text-white rounded-2xl rounded-br-md'
              : 'bg-white text-gray-800 border border-punch-border rounded-2xl rounded-bl-md shadow-sm'
          }`}
        >
          <p className="text-[15px] leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  )
}

interface ChatConversationProps {
  messages: Array<{
    text: string
    isUser: boolean
    timestamp?: string
  }>
  className?: string
}

export function ChatConversation({ messages, className = '' }: ChatConversationProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {messages.map((msg, i) => (
        <ChatBubble
          key={i}
          message={msg.text}
          isUser={msg.isUser}
          delay={i * 0.3}
          showTimestamp={!!msg.timestamp}
          timestamp={msg.timestamp}
        />
      ))}
    </div>
  )
}
